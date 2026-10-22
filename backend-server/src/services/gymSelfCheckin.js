/**
 * Shared "studio QR" self check-in.
 *
 * Used by BOTH:
 *  - POST /api/attendance/gym-scan — the in-portal scanner (toggles check-in/out)
 *  - POST /api/me/checkin-gym      — scan-the-wall-QR login flow (check-in only)
 *
 * The QR carries ONLY the studio's opaque token — never a password or personal
 * data. Every scan is re-validated server-side for the signed-in member.
 */

import AttendanceRecord from "../models/AttendanceRecord.js";
import ClassSlot from "../models/ClassSlot.js";
import { badRequest } from "../lib/errors.js";
import { minutesInTz, ymdInTz } from "../lib/dates.js";
import { toMinutes } from "../lib/schedule.js";
import { parseQrPayload } from "../lib/qr.js";
import { toAttendance } from "../lib/serialize.js";
import { writeAudit } from "../lib/audit.js";
import { runCheckIn } from "./checkin.js";
import { notifyIfOverPlanned, notifyExpiredScan } from "./overtime.js";
import { markSlotAttendance } from "./classAttendance.js";

/** `13:05` → `1:05 PM` — matches the Manage Institute slot labels. */
function fmt12h(hhmm) {
  const [h, m] = String(hhmm).split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m ?? 0).padStart(2, "0")} ${suffix}`;
}

/** Great-circle distance in meters (Haversine) — GPS range check. */
function haversineMeters(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Verify the scanned payload is THIS studio's shared QR token. Accepts the
 * bare token, the legacy "PGS1:<token>" payload, or the printed login URL.
 * Throws `invalid_gym_qr` otherwise — a member's PERSONAL QR never passes here.
 */
export function assertGymQrToken(gym, raw) {
  const token = parseQrPayload(raw) ?? String(raw ?? "").trim();
  if (!gym.gymQrToken || token !== gym.gymQrToken) {
    throw badRequest(
      "That is not this studio's QR code. Please scan the QR at the front desk.",
      "invalid_gym_qr",
    );
  }
  return token;
}

/**
 * Best-effort automatic register mark for a studio QR check-in.
 *
 * A member QR scan already creates a gym visit; this ALSO marks them "present"
 * in the class register when the scan lands inside one of the studio's running
 * slots (the student's preferred slot wins when they have one and it matches).
 * Uses the same marking engine as the roster save, so quota deduction,
 * duplicate guards and audit trails behave identically. Rejections
 * (duplicates, no slot running, not a slot day, no membership) are swallowed —
 * the visit is still recorded; the register just stays as-is.
 */
export async function autoMarkSlotAttendance({ gymId, member, actorId, ctx, now = new Date() }) {
  try {
    const tz = ctx.tz ?? "Asia/Kolkata";
    // Weekday (0=Sun…6=Sat) of "now" in the studio timezone.
    const dayKey = ymdInTz(now, tz);
    const [y, m, d] = dayKey.split("-").map(Number);
    const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
    const nowMin = minutesInTz(now, tz);

    const slots = await ClassSlot.find({ gymId, isActive: true }).lean();
    const running = (slots ?? []).filter((slot) => {
      if (!Array.isArray(slot.weekdays) || !slot.weekdays.some((x) => Number(x) === weekday)) {
        return false;
      }
      const start = toMinutes(slot.startTime);
      const end = toMinutes(slot.endTime);
      if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
      // Slots may wrap midnight — mirror the check-in-hours guard.
      return start <= end
        ? nowMin >= start && nowMin <= end
        : nowMin >= start || nowMin <= end;
    });
    if (running.length === 0) return null;

    // The student's preferred slot wins when it matches one of the running slots.
    const preferred = member.preferredSlot
      ? running.find((slot) => `${slot.startTime}-${slot.endTime}` === member.preferredSlot)
      : null;
    const slot = preferred ?? running[0];

    const result = await markSlotAttendance({
      gymId,
      actorId,
      actorRole: "member",
      slotId: slot._id,
      date: dayKey,
      lookup: { memberId: String(member._id ?? member.id ?? member) },
      method: "qr",
      attendanceStatus: "present",
      notes: "Auto-marked from the studio QR check-in",
      ctx,
    });
    return result.status === "ok" ? result : null;
  } catch {
    // Register marking is a bonus — never fail the check-in.
    return null;
  }
}

/**
 * Self check-in guard rails (member-initiated only): the studio must be open,
 * and — when the gym requires it — the phone must be near the front desk.
 * Front-desk check-outs stay free: nobody gets stuck inside.
 */
export function assertSelfCheckinAllowed({ gym, tz, coords = {}, now = new Date() }) {
  // 1) Opening hours — check-ins only while a daily slot is running.
  if (gym.enforceSlotHours !== false && (gym.timeSlots ?? []).length > 0) {
    const nowMinutes = minutesInTz(now, tz);
    const inSlot = gym.timeSlots.some((slot) => {
      const start = toMinutes(slot.start);
      const end = toMinutes(slot.end);
      if (!Number.isFinite(start) || !Number.isFinite(end)) return false;
      // A slot may wrap midnight (e.g. 22:00–02:59).
      return start <= end
        ? nowMinutes >= start && nowMinutes <= end
        : nowMinutes >= start || nowMinutes <= end;
    });
    if (!inSlot) {
      const hours = gym.timeSlots
        .map((slot) => `${fmt12h(slot.start)} – ${fmt12h(slot.end)}`)
        .join(", ");
      throw badRequest(
        `The institute is closed right now. Check-in is allowed during class hours: ${hours}.`,
        "gym_closed",
      );
    }
  }

  // 2) GPS range — on once the gym's location is saved in Manage Institute.
  const gymLat = gym.locationLat;
  const gymLng = gym.locationLng;
  if (gym.enforceLocation && gymLat != null && gymLng != null) {
    const { latitude, longitude, accuracy } = coords;
    if (latitude == null || longitude == null) {
      throw badRequest(
        "Location access is required to check in here — allow location for this site, then scan again.",
        "location_required",
      );
    }
    const radius = gym.locationRadiusM ?? 200;
    const distance = haversineMeters(gymLat, gymLng, latitude, longitude);
    // Small GPS-noise allowance (accuracy capped so a bad fix can't help).
    if (distance > radius + Math.min(accuracy ?? 0, 100)) {
      throw badRequest(
        `You are about ${Math.round(distance)} m from the studio — check-in works within ${radius} m of the front desk.`,
        "too_far",
      );
    }
  }
}

/**
 * Run the standard eligibility / duplicate / cooldown engine for the signed-in
 * member. Returns the raw CheckInResult: `{ status: "ok", attendance, member }`
 * or `{ status: "rejected", reason, message, member? }`.
 */
export async function runMemberSelfCheckIn({ member, actorId, ctx, notes = null }) {
  const now = new Date();
  const result = await runCheckIn({
    gymId: member.gymId,
    actorId,
    lookup: { code: member.memberCode },
    method: "qr",
    notes,
    ctx,
  });
  if (result.status !== "ok") {
    if (result.reason === "expired" || result.reason === "no_membership") {
      await notifyExpiredScan({ gymId: member.gymId, member, at: now });
    }
    return result;
  }
  if (result.warning === "expired") {
    // Accepted because the gym allows expired check-ins — still warn the staff.
    await notifyExpiredScan({ gymId: member.gymId, member, at: now });
  }
  // Best-effort: a studio QR check-in that lands inside one of the student's
  // running slots ALSO marks them present in the class register (Mark/View
  // attendance + shows in history). Never blocks or fails the check-in itself.
  try {
    const auto = await autoMarkSlotAttendance({ gymId: member.gymId, member, actorId, ctx, now });
    if (auto) {
      result.autoMarked = true;
      result.autoMarkedSlot = auto.attendance?.meta?.slotName ?? null;
    }
  } catch {
    // Quota/eligibility issues must never break the check-in the student just made.
  }
  return result;
}

/**
 * Close the member's open visit (the shared QR toggles check-in/out).
 * Returns the closed AttendanceRecord, or null when nothing was open.
 */
export async function closeOpenVisit({ member, actorId, now = new Date() }) {
  const open = await AttendanceRecord.findOne({
    gymId: member.gymId,
    memberId: member._id,
    status: "checked_in",
  })
    .sort({ checkIn: -1 })
    .lean();
  if (!open) return null;

  // Close every open row defensively — stale opens would otherwise make the
  // next scan check out again instead of checking in.
  await AttendanceRecord.updateMany(
    { gymId: member.gymId, memberId: member._id, status: "checked_in" },
    { $set: { checkOut: now, status: "checked_out" } },
  );
  const updated = { ...open, checkOut: now, status: "checked_out" };
  await writeAudit({
    gymId: member.gymId,
    actorId,
    entity: "attendance_records",
    entityId: String(updated._id),
    action: "checkout",
    oldValues: { status: "checked_in", checkOut: null },
    newValues: { status: "checked_out" },
  });
  await notifyIfOverPlanned({ gymId: member.gymId, member, at: now });
  return toAttendance(updated, member, null);
}
