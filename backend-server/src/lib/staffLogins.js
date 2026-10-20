import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * Staff/instructor portal logins.
 *
 * A `User` row with a staff role (owner/admin/front_desk/trainer) is linked back
 * to its `StaffProfile` via `StaffProfile.profileId` (which points at User._id).
 * The reverse lookup (login → profile) queries StaffProfile by profileId.
 *
 * Members never get one of these — their logins are created by
 * lib/memberLogins.js instead. These helpers are idempotent: creating a login
 * twice reuses the existing user, and disabling is safe when no login exists
 * yet (legacy staff with no account).
 */

/** The login user for a staff profile (profileId === User._id), or null. */
export async function findStaffLogin(profileId, session = null) {
  if (!profileId) return null;
  return User.findOne({ _id: profileId, role: { $ne: "member" } })
    .session(session)
    .lean();
}

/**
 * Create (or reuse) a staff login and link it to the profile.
 * `role` must be a staff role — never "member".
 *
 * Returns { userId, created } — `created` is false when a login already
 * existed (the password is NOT reset in that case, so re-saving a staff member
 * never silently changes their credentials).
 */
export async function ensureStaffLogin(
  { gymId, profileId, fullName, email, phone, password, role },
  session = null,
) {
  if (!email) {
    throw Object.assign(new Error("A staff login needs an email address"), {
      code: "staff_login_requires_email",
    });
  }
  if (!password || password.length < 6) {
    throw Object.assign(new Error("A staff login needs a password of at least 6 characters"), {
      code: "staff_login_requires_password",
    });
  }
  if (role === "member") {
    throw Object.assign(new Error("Staff logins must not use the member role"), {
      code: "invalid_role",
    });
  }

  const normalizedEmail = String(email).trim().toLowerCase();
  const opts = session ? { session } : {};

  // Already linked? Reuse — never overwrite an existing password on re-save.
  if (profileId) {
    const existing = await findStaffLogin(profileId, session);
    if (existing) {
      await User.updateOne(
        { _id: existing._id },
        { $set: { email: normalizedEmail, fullName, phone: phone ?? null, role } },
        opts,
      );
      return { userId: String(existing._id), created: false };
    }
  }

  // Email collision with another login (User.email is globally unique).
  const existingByEmail = await User.findOne({ email: normalizedEmail }).lean();
  if (existingByEmail) {
    throw Object.assign(new Error("A login with this email already exists"), {
      code: "duplicate_email",
    });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const [user] = await User.create(
    [
      {
        gymId,
        fullName,
        email: normalizedEmail,
        phone: phone ?? null,
        passwordHash,
        role,
        isActive: true,
      },
    ],
    opts,
  );

  return { userId: String(user._id), created: true };
}

/**
 * Enable/disable a staff login when the account is toggled.
 * Handles legacy staff with NO login row (no-op) and already-toggled rows.
 * Returns the number of users updated.
 */
export async function setStaffLoginActive(profileId, isActive, session = null) {
  if (!profileId) return 0;
  const result = await User.updateOne(
    { _id: profileId, role: { $ne: "member" } },
    { $set: { isActive: Boolean(isActive) } },
    session ? { session } : {},
  );
  return result.modifiedCount ?? 0;
}
