import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    CalendarCheckIcon,
    CheckCircle2Icon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClipboardCheckIcon,
    DownloadIcon,
    EyeIcon,
    GaugeIcon,
    HistoryIcon,
    Loader2Icon,
    PencilIcon,
    SaveIcon,
    SearchIcon,
    UsersIcon,
    XCircleIcon,
    XIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SmartImage } from "@/components/shared/SmartImage";
import { useAuth, useData } from "@/auth/AuthProvider";
import { useAsync, useDebounced } from "@/hooks";
import { downloadCsv, toCsv } from "@/lib/csv";
import { PAYMENT_METHOD_LABELS, formatDateTime, titleCase } from "@/lib/format";
import { can } from "@/lib/permissions";
import { SLOT_GROUPS, groupSlotsByTime, slotGroupOf } from "@/lib/slots";
import { cn } from "@/lib/utils";
import { AttendanceCorrectionDialog } from "./AttendanceCorrectionDialog";

/** Status → label, dot colour, chip classes (Present / Late / Absent). */
const STATUS_META = {
    present: { label: "Present", dot: "bg-emerald-500", chip: "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
    late: { label: "Late", dot: "bg-amber-500", chip: "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400" },
    absent: { label: "Absent", dot: "bg-red-500", chip: "border-red-500/40 bg-red-500/15 text-red-600 dark:text-red-400" },
};
const STATUS_ORDER = ["present", "late", "absent"];

function StatusChip({ status }) {
    const meta = STATUS_META[status];
    if (!meta) return <Badge variant="outline">—</Badge>;
    return (<Badge variant="outline" className={cn("gap-1.5 font-medium", meta.chip)}>
      <span className={cn("size-1.5 rounded-full", meta.dot)}/>
      {meta.label}
    </Badge>);
}

/** Latest payment method chip (Cash / UPI / …). */
function PaymentChip({ method }) {
    if (!method) return <span className="text-xs text-muted-foreground">—</span>;
    return (<span className="rounded-full border border-border/70 bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
      {PAYMENT_METHOD_LABELS[method] ?? titleCase(method)}
    </span>);
}

/** Paid-class quota chip for the register — "4 left".
 *  Colour rule: 4+ left green · 3–2 yellow · 1 or 0 red. Rounded pill corners. */
function ClassLeftChip({ quota }) {
    if (!quota) return <span className="text-xs text-muted-foreground">—</span>;
    const tone = quota.remaining >= 4
        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        : quota.remaining >= 2
            ? "border-amber-500/40 bg-amber-500/15 text-amber-600 dark:text-amber-400"
            : "border-red-500/40 bg-red-500/15 text-red-600 dark:text-red-400";
    return (<Badge variant="outline" className={cn("rounded-full font-semibold tabular-nums", tone)}>
      {quota.remaining} left
      {quota.exceeded > 0 ? ` · ${quota.exceeded} over` : ""}
    </Badge>);
}

/** A stat card for the header strip (Total Students / Present / Absent / Rate). */
function StatCard({ label, value, icon, tone }) {
    const tones = {
        neutral: "bg-secondary text-muted-foreground",
        present: "bg-emerald-500/15 text-emerald-500",
        absent: "bg-red-500/15 text-red-500",
        rate: "bg-km-gold/15 text-km-gold",
    };
    return (<Card className="graphite-surface border-border/70 py-0">
      <CardContent className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div>
          <p className="text-[10px] font-medium leading-tight tracking-wide text-muted-foreground">{label}</p>
          <p className="text-lg font-semibold leading-tight tracking-tight tabular-nums">{value}</p>
        </div>
        <span className={cn("flex size-6 shrink-0 items-center justify-center rounded-md", tones[tone] ?? tones.neutral)}>
          {icon}
        </span>
      </CardContent>
    </Card>);
}

function SectionHeading({ icon, title, description }) {
    return (<div className="flex items-start gap-3">
      <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl border border-km-gold/30 bg-km-gold/10 text-km-gold">
        {icon}
      </span>
      <div className="min-w-0">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>);
}

const ymdOf = (d) => format(d, "yyyy-MM-dd");

/** "HH:mm" → minutes since midnight (NaN on junk). */
const toMin = (hhmm) => {
    const [h, m] = String(hhmm ?? "").split(":").map(Number);
    return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};

/** Format a plain "HH:mm" studio time as "8:00 AM" (12-hour clock + AM/PM). */
function fmtSlotTime(hhmm) {
    const m = toMin(hhmm);
    if (!Number.isFinite(m)) return "";
    const h24 = Math.floor(m / 60);
    const mins = String(m % 60).padStart(2, "0");
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${mins} ${h24 < 12 ? "AM" : "PM"}`;
}

/** Dot colour per time-of-day group, so a student's batch reads at a glance. */
const GROUP_DOT = {
    morning: "bg-amber-500",
    afternoon: "bg-orange-500",
    evening: "bg-sky-500",
};

/**
 * Pick the slot to preselect for marking: the one running RIGHT NOW,
 * else the next one to start later today, else the first active slot.
 * Returns null when there are no active slots.
 */
function pickLiveSlot(activeSlots, now = new Date()) {
    if (!activeSlots.length) return null;
    const weekday = now.getDay();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const today = activeSlots.filter((s) => Array.isArray(s.weekdays) && s.weekdays.includes(weekday));
    // Currently running: start <= now < end.
    const running = today.find((s) => toMin(s.startTime) <= nowMin && nowMin < toMin(s.endTime));
    if (running) return running;
    // Next to start today (after now).
    const upcoming = today
        .filter((s) => toMin(s.startTime) > nowMin)
        .sort((a, b) => toMin(a.startTime) - toMin(b.startTime));
    if (upcoming.length) return upcoming[0];
    return activeSlots[0];
}

export function AttendancePage() {
    const data = useData();
    const { session } = useAuth();
    const canCorrect = can(session?.profile.role, "attendance.correct");

    /* ------------------------------ header stats ----------------------------- */
    const [summaryDate] = useState(() => ymdOf(new Date()));
    const summary = useAsync(() => data.getClassDaySummary(summaryDate), [data, summaryDate]);

    /* ------------------------------ mark section ----------------------------- */
    const slots = useAsync(() => data.listClassSlots(), [data]);
    const activeSlots = useMemo(() => (slots.data ?? []).filter((s) => s.isActive), [slots.data]);

    // One two-level "Slot" dropdown (Morning / Afternoon / Evening → that
    // group's time slots). Only one group can be open at a time. Within it the
    // pick is either "__all__" (Select All Slots) or a single class-slot id.
    const [slotGroup, setSlotGroup] = useState("all"); // "all"|"morning"|"afternoon"|"evening"
    const [slotPick, setSlotPick] = useState(""); // slotId | "__all__" | ""
    const [loadAll, setLoadAll] = useState(false); // Load All → every active slot's students
    const [markDate, setMarkDate] = useState(() => ymdOf(new Date()));
    const [loadedQuery, setLoadedQuery] = useState(null); // { slotIds: [], date }

    const groupedSlots = useMemo(() => groupSlotsByTime(activeSlots, "startTime"), [activeSlots]);
    /* Two cascading dropdowns: "Slot" (All/Morning/Afternoon/Evening) and
       "Slot Timings" (that scope's time slots). */
    const currentGroupSlots = slotGroup === "all" ? activeSlots : (groupedSlots[slotGroup] ?? []);
    const activeGroup = slotGroup === "all" ? null : (SLOT_GROUPS.find((g) => g.key === slotGroup) ?? null);

    // Which class slots the current pick resolves to.
    const selectedSlotIds = useMemo(() => {
        if (loadAll) return activeSlots.map((s) => s.id);
        if (!slotPick) return [];
        const list = slotGroup === "all" ? activeSlots : (groupedSlots[slotGroup] ?? []);
        if (slotPick === "__all__") return list.map((s) => s.id);
        return list.some((s) => s.id === slotPick) ? [slotPick] : [];
    }, [loadAll, slotGroup, slotPick, groupedSlots, activeSlots]);
    const [statuses, setStatuses] = useState({}); // memberId -> present|late|absent (local, unsaved)
    const [savedStatuses, setSavedStatuses] = useState({}); // last persisted statuses
    const [savingId, setSavingId] = useState(null); // single-row save (edit mode)
    const [savingAll, setSavingAll] = useState(false); // bulk Save button
    const [editingId, setEditingId] = useState(null); // saved row being edited
    const [markAllChecked, setMarkAllChecked] = useState(false);
    const [studentQuery, setStudentQuery] = useState("");

    // Auto-select the live (or next) slot ONCE so the panel opens on whichever
    // class is running right now. A ref guard keeps it from re-picking after
    // the admin clears the selection (that made the Clear button look broken).
    const autoPickedRef = useRef(false);
    useEffect(() => {
        if (autoPickedRef.current || activeSlots.length === 0) return;
        const pick = pickLiveSlot(activeSlots);
        autoPickedRef.current = true;
        if (pick) {
            setSlotGroup(slotGroupOf(pick.startTime) ?? "morning");
            setSlotPick(pick.id);
        }
        // Only on first load — never after a manual Clear.
    }, [activeSlots]);

    // Load the roster automatically whenever the selection/date changes.
    const selectedKey = selectedSlotIds.join(",");
    useEffect(() => {
        if (!selectedKey) {
            setLoadedQuery(null);
            return;
        }
        setLoadedQuery({ slotIds: selectedKey.split(","), date: markDate });
    }, [selectedKey, markDate]);

    // Combined roster: fetch every selected slot's roster in parallel and merge
    // students (deduped by member), tagging each with the slot they belong to
    // so Save marks every student in their OWN slot.
    const roster = useAsync(async () => {
        if (!loadedQuery || loadedQuery.slotIds.length === 0) return null;
        if (loadedQuery.slotIds.length === 1) {
            const single = await data.getClassRoster(loadedQuery.slotIds[0], loadedQuery.date);
            if (!single) return single;
            return {
                ...single,
                students: (single.students ?? []).map((s) => ({ ...s, slotId: loadedQuery.slotIds[0] })),
            };
        }
        const results = await Promise.all(loadedQuery.slotIds.map((id) => data.getClassRoster(id, loadedQuery.date)));
        // Every slot now returns the full studio roster — keep one row per
        // student, preferring the slot they are actually enrolled in so Save
        // attributes the mark to the right batch.
        const byId = new Map();
        results.forEach((result, index) => {
            const slotId = loadedQuery.slotIds[index];
            for (const s of result.students ?? []) {
                const prev = byId.get(s.memberId);
                if (!prev || (s.enrolled && !prev.enrolled)) {
                    byId.set(s.memberId, { ...s, slotId });
                }
            }
        });
        return { students: [...byId.values()], date: loadedQuery.date };
    }, [data, loadedQuery], { enabled: !!loadedQuery && loadedQuery.slotIds.length > 0 });

    // Seed the status map from the roster whenever it loads.
    useEffect(() => {
        if (!roster.data?.students) return;
        const next = {};
        for (const s of roster.data.students) next[s.memberId] = s.attendanceStatus ?? null;
        setStatuses(next);
        setSavedStatuses(next);
        setMarkAllChecked(false);
        setEditingId(null);
    }, [roster.data]);

    const students = useMemo(() => roster.data?.students ?? [], [roster.data]);
    // Filter the loaded roster by student name or ID.
    const filteredStudents = useMemo(() => {
        const q = studentQuery.trim().toLowerCase();
        if (!q) return students;
        return students.filter((s) => (s.fullName ?? "").toLowerCase().includes(q) ||
            (s.memberCode ?? "").toLowerCase().includes(q));
    }, [students, studentQuery]);

    /* ------------------------------ walk-in students ------------------------- */
    // Students from OTHER slots who show up at a different time: search finds
    // them outside the loaded roster and the admin can mark them present/absent
    // for this session directly.
    const debouncedQuery = useDebounced(studentQuery, 300);
    const walkInSearch = useAsync(() => (debouncedQuery.trim()
        ? data.listMembers({ search: debouncedQuery.trim(), pageSize: 5 })
        : Promise.resolve({ items: [] })), [data, debouncedQuery], { enabled: debouncedQuery.trim().length > 0 });
    const rosterIds = useMemo(() => new Set(students.map((s) => s.memberId)), [students]);
    const walkIns = useMemo(() => (walkInSearch.data?.items ?? []).filter((m) => !rosterIds.has(m.id) && m.status === "active"), [walkInSearch.data, rosterIds]);
    const [walkInSavingId, setWalkInSavingId] = useState(null);
    const markWalkIn = async (memberId, status) => {
        // Walk-ins land in the first selected slot of the active group.
        const slotId = loadedQuery?.slotIds?.[0];
        if (!slotId) return;
        setWalkInSavingId(memberId);
        try {
            const result = await data.markClassAttendance({ slotId, date: markDate, memberId, method: "class" });
            if (result.status === "ok") {
                toast.success(`Marked ${status}`);
                roster.reload();
            }
            else {
                toast.error(result.message ?? "Could not mark attendance.");
            }
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to mark attendance.");
        }
        setWalkInSavingId(null);
    };

    const persist = async (marks) => {
        try {
            // A combined roster spans several class slots — group each student's
            // mark by their own slot and commit one request per slot.
            const bySlot = new Map();
            const slotOf = new Map(students.map((s) => [s.memberId, s.slotId ?? loadedQuery?.slotIds?.[0]]));
            for (const m of marks) {
                const sid = slotOf.get(m.memberId) ?? loadedQuery?.slotIds?.[0];
                if (!sid) continue;
                if (!bySlot.has(sid)) bySlot.set(sid, []);
                bySlot.get(sid).push(m);
            }
            let total = 0;
            for (const [sid, slotMarks] of bySlot) {
                const result = await data.markRosterAttendance({ slotId: sid, date: loadedQuery.date, marks: slotMarks });
                if (result.status !== "ok") {
                    toast.error(result.message ?? "Could not save attendance.");
                    return false;
                }
                total += result.marked ?? slotMarks.length;
            }
            toast.success(`Saved ${total} ${total === 1 ? "student" : "students"}`);
            roster.reload(); // seed effect re-syncs statuses + savedStatuses from the server
            summary.reload();
            return true;
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to save attendance.");
            return false;
        }
    };

    // Rows whose local selection differs from the last saved state.
    const pendingCount = students.filter((s) => statuses[s.memberId] && (statuses[s.memberId] ?? null) !== (savedStatuses[s.memberId] ?? null)).length;
    const hasChanges = pendingCount > 0;

    // Clicking a status before saving = local selection only (no API call).
    const selectStatus = (memberId, status) => {
        setStatuses((prev) => ({ ...prev, [memberId]: status }));
    };

    // Bulk Save — persists every pending mark at once.
    const saveAll = async () => {
        setSavingAll(true);
        const marks = students
            .filter((s) => statuses[s.memberId])
            .map((s) => ({ memberId: s.memberId, status: statuses[s.memberId] }));
        if (marks.length > 0) await persist(marks);
        setSavingAll(false);
    };

    // Independent per-student edit (after a save) — persists that one row immediately.
    const saveStudent = async (memberId, status) => {
        setStatuses((prev) => ({ ...prev, [memberId]: status }));
        setSavingId(memberId);
        const ok = await persist([{ memberId, status }]);
        setSavingId(null);
        if (ok) setEditingId(null);
    };

    // Mark All = local selection only; the admin still hits Save to commit.
    const markAll = () => {
        setMarkAllChecked(true);
        const next = { ...statuses };
        for (const s of students) next[s.memberId] = "present";
        setStatuses(next);
    };

    // The class slots behind the current pick (1 for a single slot, many for Select All).
    const selectedSlots = useMemo(() => selectedSlotIds
        .map((id) => activeSlots.find((s) => s.id === id))
        .filter(Boolean), [selectedSlotIds, activeSlots]);

    /* ------------------------------- view section ---------------------------- */
    const [viewSlotId, setViewSlotId] = useState("all");
    const [viewDate, setViewDate] = useState(() => ymdOf(new Date()));
    const [search, setSearch] = useState("");
    const [editing, setEditing] = useState(null); // attendance record being corrected

    const dayRange = useMemo(() => {
        const [y, m, d] = viewDate.split("-").map(Number);
        const start = new Date(y, m - 1, d);
        return { from: start.toISOString(), to: new Date(start.getTime() + 86_399_999).toISOString() };
    }, [viewDate]);

    const list = useAsync(() => data.listAttendance({ from: dayRange.from, to: dayRange.to, page: 1, pageSize: 100 }), [data, dayRange]);

    // Class-attendance rows only (those carry an attendanceStatus).
    const classRows = useMemo(() => {
        const rows = (list.data?.items ?? []).filter((r) => r.attendanceStatus);
        return rows;
    }, [list.data]);

    const filteredRows = useMemo(() => {
        const q = search.trim().toLowerCase();
        return classRows.filter((r) => {
            if (viewSlotId !== "all" && String(r.classSlotId ?? "") !== viewSlotId) return false;
            if (q && !(`${r.memberName ?? ""} ${r.memberCode ?? ""}`.toLowerCase().includes(q))) return false;
            return true;
        });
    }, [classRows, viewSlotId, search]);

    const shiftDay = (dir) => {
        const [y, m, d] = viewDate.split("-").map(Number);
        setViewDate(ymdOf(new Date(y, m - 1 + dir, d)));
    };

    /** slotId → slot lookup, so a row can show its class time ("7:00 AM – 8:15 AM").
     *  Uses the FULL slot list (not just active) so archived slots still resolve. */
    const slotById = useMemo(() => new Map((slots.data ?? []).map((s) => [String(s.id), s])), [slots.data]);
    /** "HH:mm-HH:mm" → slot, so a student's preferred slot still resolves even
     *  when they aren't formally enrolled in a batch yet. */
    const slotByTime = useMemo(
        () => new Map((slots.data ?? []).map((s) => [`${s.startTime}-${s.endTime}`, s])),
        [slots.data],
    );

    /** "7:00 AM – 8:15 AM" for a row's class slot; walk-ins have no time.
     *  Prefers the time the API already ships on the row, then falls back to a
     *  lookup against the locally loaded slot list (covers records written
     *  before the route started returning the times). */
    const slotTimeOf = (row) => {
        const start = row.slotStartTime;
        const end = row.slotEndTime;
        if (start && end) return `${fmtSlotTime(start)} – ${fmtSlotTime(end)}`;
        const slot = slotById.get(String(row.classSlotId ?? row.meta?.slotId ?? ""));
        if (!slot?.startTime || !slot?.endTime) return null;
        return `${fmtSlotTime(slot.startTime)} – ${fmtSlotTime(slot.endTime)}`;
    };

    /** Format one batch as "Morning · 8:00 AM – 9:00 AM" (or just its time). */
    const formatSlot = (slot) => {
        const group = SLOT_GROUPS.find((g) => g.key === slotGroupOf(slot.startTime));
        const time = slot.startTime && slot.endTime
            ? `${fmtSlotTime(slot.startTime)} – ${fmtSlotTime(slot.endTime)}`
            : "";
        if (!group) return time || slot.name || "Class";
        const short = group.label.replace(/\s+Slots$/, "");
        return time ? `${short} · ${time}` : short;
    };

    /** Which batch a roster student belongs to → { key, text, count, extras }.
     *  e.g. { key: "morning", text: "Morning · 8:00 AM – 9:00 AM", count: 2, extras: "…" }.
     *  Prefers their actual enrolments, falling back to their preferred slot.
     *  `count`/`extras` power the "+N" hover that lists the other batches. */
    const slotLabelOf = (s) => {
        const ids = Array.isArray(s?.enrolledSlotIds) && s.enrolledSlotIds.length > 0
            ? s.enrolledSlotIds
            : (s?.slotId ? [s.slotId] : []);
        const preferred = s?.preferredSlot ? slotByTime.get(String(s.preferredSlot)) ?? null : null;
        const primary = slotById.get(String(ids[0] ?? "")) ?? preferred;
        if (!primary) return null;
        const extras = ids.slice(1).map((id) => slotById.get(String(id))).filter(Boolean).map(formatSlot);
        const extrasText = extras.length > 0 ? `Also enrolled:\n${extras.join("\n")}` : "";
        return {
            key: slotGroupOf(primary.startTime) ?? null,
            text: formatSlot(primary),
            count: extras.length,
            extras: extrasText,
        };
    };

    /** Human day label shown in the register header ("Wed, 21 Oct 2026"). */
    const viewDateLabel = (() => {
        const parsed = new Date(`${viewDate}T00:00:00`);
        return Number.isNaN(parsed.getTime()) ? "" : format(parsed, "EEE, d MMM yyyy");
    })();

    const handleExport = () => {
        if (filteredRows.length === 0) {
            toast.info("Nothing to export for this day.");
            return;
        }
        const indexed = filteredRows.map((row, index) => ({ row, index }));
        downloadCsv(`attendance-${viewDate}`, toCsv(indexed, [
            { header: "Sr. no.", accessor: (r) => r.index + 1 },
            { header: "Student", accessor: (r) => r.row.memberName ?? "" },
            { header: "Student ID", accessor: (r) => r.row.memberCode ?? "" },
            { header: "Payment Mode", accessor: (r) => (r.row.paymentMethod ? PAYMENT_METHOD_LABELS[r.row.paymentMethod] ?? titleCase(r.row.paymentMethod) : "") },
            { header: "Classes", accessor: (r) => (r.row.quota ? `${r.row.quota.attended}/${r.row.quota.quota}` : "") },
            { header: "Class Left", accessor: (r) => (r.row.quota ? r.row.quota.remaining : "") },
            { header: "Slot Time", accessor: (r) => slotTimeOf(r.row) ?? "" },
            { header: "Date", accessor: (r) => r.row.sessionDate ?? "" },
            { header: "Status", accessor: (r) => STATUS_META[r.row.attendanceStatus]?.label ?? "" },
            { header: "Marked By", accessor: (r) => r.row.scannerName ?? "" },
        ]));
        toast.success(`Exported ${filteredRows.length} records`);
    };

    const summaryData = summary.data;

    return (<div className="space-y-8">
      {/* ------------------------------- Header ------------------------------- */}
      <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-km-gold">
            <CalendarCheckIcon className="size-4"/>
            <span className="text-sm font-medium">Attendance</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Manage Attendance</h1>
          <p className="max-w-xl text-sm text-muted-foreground">
            Mark attendance for students and view past records — all in one place.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-4 xl:w-auto">
          <StatCard label="Total Students" value={summaryData?.totalStudents ?? 0} icon={<UsersIcon className="size-4"/>} tone="neutral"/>
          <StatCard label="Present Today" value={summaryData?.presentToday ?? 0} icon={<CheckCircle2Icon className="size-4"/>} tone="present"/>
          <StatCard label="Absent Today" value={summaryData?.absentToday ?? 0} icon={<XCircleIcon className="size-4"/>} tone="absent"/>
          <StatCard label="Attendance Rate" value={`${summaryData?.attendanceRate ?? 0}%`} icon={<GaugeIcon className="size-4"/>} tone="rate"/>
        </div>
      </div>

      {/* ---------------------------- Mark Attendance --------------------------- */}
      <Card className="graphite-surface border-border/70">
        <CardContent className="space-y-5 p-5">
          <SectionHeading icon={<ClipboardCheckIcon className="size-5"/>} title="Mark Attendance" description="Select a class, then mark attendance for each student."/>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">Pick a slot (and its timing) — or load every student at once.</p>
            <Button size="sm" variant="outline" className="h-8 gap-1.5 px-3" disabled={slots.loading || activeSlots.length === 0 || loadAll} onClick={() => {
              setLoadAll(true);
              setSlotGroup("all");
              setSlotPick("");
            }}>
              <UsersIcon className="size-3.5"/> Load All
            </Button>
          </div>

          {/* Two cascading dropdowns: Slot (All/Morning/Afternoon/Evening) and
              Slot Timings (that scope's time slots). */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="mark-slot-group">Slot</Label>
              <select
                id="mark-slot-group"
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                disabled={slots.loading || activeSlots.length === 0 || loadAll}
                value={slotGroup}
                onChange={(e) => {
                  setLoadAll(false);
                  setSlotGroup(e.target.value);
                  setSlotPick("");
                }}
              >
                <option value="all">All Slots</option>
                {SLOT_GROUPS.map((group) => {
                  const count = (groupedSlots[group.key] ?? []).length;
                  return (<option key={group.key} value={group.key} disabled={count === 0}>
                    {group.label.replace(/\s+Slots$/, "")}{count === 0 ? " (none)" : ` (${count})`}
                  </option>);
                })}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mark-slot-timings">Slot Timings</Label>
              <select
                id="mark-slot-timings"
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30"
                disabled={slots.loading || activeSlots.length === 0 || loadAll}
                value={slotPick}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "") { setSlotPick(""); return; }
                  setLoadAll(false);
                  setSlotPick(v);
                }}
              >
                <option value="" disabled>Select a time…</option>
                <option value="__all__">Select All Slots ({currentGroupSlots.length})</option>
                {slotGroup === "all"
                  ? SLOT_GROUPS.map((group) => {
                      const gs = groupedSlots[group.key] ?? [];
                      if (gs.length === 0) return null;
                      return (<optgroup key={group.key} label={group.label.replace(/\s+Slots$/, "")}>
                        {gs.map((s) => (<option key={s.id} value={s.id}>
                          {fmtSlotTime(s.startTime)} – {fmtSlotTime(s.endTime)}
                        </option>))}
                      </optgroup>);
                    })
                  : currentGroupSlots.map((s) => (<option key={s.id} value={s.id}>
                      {fmtSlotTime(s.startTime)} – {fmtSlotTime(s.endTime)}
                    </option>))}
              </select>
            </div>
          </div>
          {(loadAll || slotPick) ? (<div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">{loadAll ? "Load All:" : slotGroup === "all" ? "All Slots:" : `${activeGroup?.label}:`}</span>
              {loadAll
                ? `${selectedSlots.length} slots — every student loaded, each saved to their own slot`
                : slotPick === "__all__"
                  ? `${selectedSlots.length} slots selected — each student is saved to their own slot`
                  : `${selectedSlots.length} slot selected`}
              <Button size="sm" variant="ghost" className="h-6 px-2 text-xs" aria-label="Clear slot selection" onClick={() => {
                setLoadAll(false);
                setSlotGroup("all");
                setSlotPick("");
              }}>
                <XIcon className="size-3"/> Clear
              </Button>
            </div>) : null}

          <div className="grid gap-4 lg:grid-cols-[1fr_180px] lg:items-end">
            <div className="space-y-1.5">
              <Label htmlFor="mark-student-search">Search student</Label>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                <Input id="mark-student-search" placeholder="Name or ID…" value={studentQuery} onChange={(e) => setStudentQuery(e.target.value)} className="pl-9"/>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mark-date">Session Date</Label>
              <Input id="mark-date" type="date" value={markDate} onChange={(e) => setMarkDate(e.target.value)}/>
            </div>
          </div>

          {/* Students panel */}
          <div className="rounded-xl border border-border/70">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UsersIcon className="size-4 text-muted-foreground"/>
                Students{" "}
                <span className="text-muted-foreground">
                  ({filteredStudents.length === students.length
                    ? students.length
                    : `${filteredStudents.length}/${students.length}`})
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-emerald-500"/> Present</span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-red-500"/> Absent</span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground"><span className="size-2 rounded-full bg-amber-500"/> Late</span>
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox checked={markAllChecked} disabled={students.length === 0} onCheckedChange={(v) => v === true ? markAll() : setMarkAllChecked(false)}/>
                  Mark All
                </label>
              </div>
            </div>

            {!loadedQuery ? (<div className="flex flex-col items-center gap-2 px-4 py-12 text-center">
                <span className="flex size-12 items-center justify-center rounded-full border border-km-gold/30 bg-km-gold/10 text-km-gold">
                  <UsersIcon className="size-5"/>
                </span>
                <p className="text-sm font-medium">Pick a slot timing to load students</p>
                <p className="text-xs text-muted-foreground">Students will appear here to mark their attendance.</p>
              </div>) : roster.loading ? (<div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading students…</div>) : students.length === 0 ? (<div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No students yet — add one from the Students page.
              </div>) : filteredStudents.length === 0 ? (<div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No students match “{studentQuery.trim()}”.
              </div>) : (<ul className="divide-y divide-border/60">
                {filteredStudents.map((s) => {
              const saved = savedStatuses[s.memberId] ?? null;
              const isEditing = editingId === s.memberId;
              const isSaved = Boolean(saved) && !isEditing;
              const enrolled = slotLabelOf(s);
              return (<li key={s.memberId} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold uppercase text-muted-foreground">
                        {(s.fullName ?? "S").slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{s.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          <span>{s.memberCode ?? "—"}</span>
                          {enrolled ? (<span className="ml-1.5 inline-flex items-center gap-1.5 align-middle whitespace-nowrap">
                              <span aria-hidden="true" className={cn("size-1.5 shrink-0 rounded-full", GROUP_DOT[enrolled.key] ?? "bg-muted-foreground/40")}/>
                              <span>{enrolled.text}</span>
                              {enrolled.count > 0 ? (<span className="cursor-help text-muted-foreground/70" title={enrolled.extras}>+{enrolled.count}</span>) : null}
                            </span>) : null}
                        </p>
                      </div>
                      {savingId === s.memberId ? <Loader2Icon className="size-3.5 animate-spin text-muted-foreground"/> : null}
                    </div>
                    {isSaved ? (<div className="flex items-center gap-2">
                        <StatusChip status={saved}/>
                        <Button size="sm" variant="outline" className="h-8 px-3" aria-label={`Edit attendance for ${s.fullName}`} onClick={() => {
                setEditingId(s.memberId);
                setStatuses((prev) => ({ ...prev, [s.memberId]: saved }));
            }}>
                          <PencilIcon className="size-3.5"/> Edit
                        </Button>
                      </div>) : (<div className="flex items-center gap-1.5">
                        {STATUS_ORDER.map((st) => {
                const meta = STATUS_META[st];
                const active = statuses[s.memberId] === st;
                return (<Button key={st} size="sm" variant={active ? "secondary" : "outline"} aria-pressed={active} className={cn("h-8 px-3", active && meta.chip)} onClick={() => isEditing ? saveStudent(s.memberId, st) : selectStatus(s.memberId, st)}>
                              {meta.label}
                            </Button>);
            })}
                        {isEditing ? (<Button size="sm" variant="ghost" className="h-8 px-2 text-muted-foreground" aria-label="Cancel edit" onClick={() => setEditingId(null)}>
                            <XIcon className="size-3.5"/>
                          </Button>) : null}
                      </div>)}
                  </li>);
            })}
              </ul>)}

          {/* Walk-in students (search-only, outside the slot roster) — shown when
              the search matches students not enrolled in this slot. */}
          {studentQuery.trim() && walkIns.length > 0 ? (<div className="border-t border-border/70 px-4 py-3">
              <p className="text-xs font-medium text-muted-foreground">Walk-in · not in this slot</p>
              <ul className="mt-2 space-y-2">
                {walkIns.map((m) => (<li key={m.id} className="flex items-center justify-between gap-3 rounded-lg border border-border/60 px-3 py-2">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold uppercase text-muted-foreground">
                        {(m.fullName ?? "S").slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{m.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{m.memberCode ?? "—"}{m.planName ? ` · ${m.planName}` : ""}</p>
                      </div>
                    </div>
                    {walkInSavingId === m.id ? <Loader2Icon className="size-4 animate-spin text-muted-foreground"/> : (<div className="flex items-center gap-1.5">
                        <Button size="sm" variant="outline" className="h-8 px-3 hover:border-emerald-500/40 hover:text-emerald-600" onClick={() => markWalkIn(m.id, "present")}>
                          Present
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 px-3 hover:border-red-500/40 hover:text-red-600" onClick={() => markWalkIn(m.id, "absent")}>
                          Absent
                        </Button>
                      </div>)}
                  </li>))}
              </ul>
            </div>) : null}

          {/* Save bar — bulk commit at the bottom of the sheet. */}
          {students.length > 0 ? (<div className="flex items-center justify-between gap-3 border-t border-border/70 px-4 py-3">
              <p className="text-xs text-muted-foreground">
                {hasChanges
                  ? `${pendingCount} ${pendingCount === 1 ? "change" : "changes"} unsaved`
                  : "All changes saved"}
              </p>
              <Button size="sm" className="h-8 gap-1.5 px-4" disabled={!hasChanges || savingAll} onClick={saveAll}>
                {savingAll ? <Loader2Icon className="size-3.5 animate-spin"/> : <SaveIcon className="size-3.5"/>}
                Save{pendingCount > 0 ? ` (${pendingCount})` : ""}
              </Button>
            </div>) : null}
          </div>

          {selectedSlots.length > 0 && loadedQuery ? (<p className="text-xs text-muted-foreground">
              {[...new Set(selectedSlots.map((s) => s.instructorName).filter(Boolean))].map((name, i, arr) => (<span key={name}>
                  {i === 0 ? "Instructor" : ""}: <span className="font-medium text-foreground">{name}</span>
                  {i < arr.length - 1 ? ", " : ""}
                </span>))}
              {[...new Set(selectedSlots.map((s) => s.instructorName).filter(Boolean))].length === 0 ? "No instructor assigned" : null}
            </p>) : null}
        </CardContent>
      </Card>

      {/* ------------------------------ View section ---------------------------- */}
      <Card className="graphite-surface border-border/70">
        <CardContent className="space-y-5 p-5">
          <SectionHeading icon={<HistoryIcon className="size-5"/>} title="View Attendance" description="Review a day's register — payment and class quota for every student."/>

          {/* Filters */}
          <div className="grid gap-3 lg:grid-cols-[200px_auto_1fr_auto] lg:items-end">
            <div className="space-y-1.5">
              <Label>Class Slot</Label>
              <Select value={viewSlotId} onValueChange={setViewSlotId}>
                <SelectTrigger className="w-full"><SelectValue placeholder="All Classes"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  {SLOT_GROUPS.map((group) => {
                    const groupSlots = groupedSlots[group.key] ?? [];
                    if (groupSlots.length === 0) return null;
                    return (<SelectGroup key={group.key}>
                      <SelectLabel>{group.label}</SelectLabel>
                      {groupSlots.map((s) => (<SelectItem key={s.id} value={s.id}>
                          {s.name ? `${s.name} · ` : ""}{fmtSlotTime(s.startTime)} - {fmtSlotTime(s.endTime)}
                        </SelectItem>))}
                    </SelectGroup>);
                  })}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Date</Label>
              <div className="flex items-center gap-2">
                <Input type="date" value={viewDate} onChange={(e) => setViewDate(e.target.value)} className="w-[160px]"/>
                <Button size="icon-sm" variant="outline" aria-label="Previous day" onClick={() => shiftDay(-1)}>
                  <ChevronLeftIcon/>
                </Button>
                <Button size="icon-sm" variant="outline" aria-label="Next day" onClick={() => shiftDay(1)}>
                  <ChevronRightIcon/>
                </Button>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="student-search">Student</Label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
                <Input id="student-search" placeholder="Search by name or ID…" className="pl-8" value={search} onChange={(e) => setSearch(e.target.value)}/>
              </div>
            </div>
            <Button variant="outline" onClick={handleExport} disabled={list.loading}>
              {list.loading ? <Loader2Icon className="size-4 animate-spin"/> : <DownloadIcon className="size-4"/>}
              Export CSV
            </Button>
          </div>

          {/* Register table */}
          <div className="rounded-xl border border-border/70">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <CalendarCheckIcon className="size-4 text-muted-foreground"/>
                Register{" "}
                <span className="text-muted-foreground">
                  ({filteredRows.length === classRows.length
                    ? classRows.length
                    : `${filteredRows.length}/${classRows.length}`})
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                {viewDateLabel}
              </div>
            </div>

            {list.loading ? (<div className="px-4 py-10 text-center text-sm text-muted-foreground">Loading attendance…</div>) : filteredRows.length === 0 ? (<div className="px-4 py-10 text-center text-sm text-muted-foreground">
                No attendance recorded for {formatDateTime(new Date(`${viewDate}T00:00:00`)).split(",")[0]}.
              </div>) : (<div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">Sr. no.</TableHead>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Payment Mode</TableHead>
                      <TableHead>Classes</TableHead>
                      <TableHead>Class Left</TableHead>
                      <TableHead>Slot Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRows.map((row, index) => (<TableRow key={row.id}>
                        <TableCell className="text-sm text-muted-foreground tabular-nums">{index + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <SmartImage src={row.memberPhoto} name={row.memberName ?? "Student"} className="size-8 shrink-0"/>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium">{row.memberName ?? "Student"}</p>
                              <p className="truncate text-xs text-muted-foreground">{row.memberCode ?? "—"}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell><PaymentChip method={row.paymentMethod}/></TableCell>
                        <TableCell className="text-sm tabular-nums text-muted-foreground">
                          {row.quota ? `${row.quota.attended}/${row.quota.quota}` : "—"}
                        </TableCell>
                        <TableCell><ClassLeftChip quota={row.quota}/></TableCell>
                        <TableCell className="text-sm tabular-nums text-muted-foreground">
                          {slotTimeOf(row) ?? "—"}
                        </TableCell>
                        <TableCell><StatusChip status={row.attendanceStatus}/></TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button size="icon-xs" variant="ghost" aria-label={`Open ${row.memberName ?? "student"}'s profile`} asChild>
                              <Link to={`/members/${row.memberId}`}>
                                <EyeIcon/>
                              </Link>
                            </Button>
                            {canCorrect ? (<Button size="icon-xs" variant="ghost" aria-label={`Correct attendance for ${row.memberName ?? "student"}`} onClick={() => setEditing(row)}>
                                <PencilIcon/>
                              </Button>) : null}
                          </div>
                        </TableCell>
                      </TableRow>))}
                  </TableBody>
                </Table>
              </div>)}
          </div>
        </CardContent>
      </Card>

      <AttendanceCorrectionDialog record={editing} open={editing !== null} onOpenChange={(open) => {
            if (!open)
                setEditing(null);
        }} onSaved={() => {
            list.reload();
            summary.reload();
        }}/>

      {/* History link */}
      <div className="flex justify-end">
        <Button variant="outline" asChild>
          <a href="/attendance/history">
            <HistoryIcon className="size-4"/> Full attendance history
          </a>
        </Button>
      </div>
    </div>);
}
