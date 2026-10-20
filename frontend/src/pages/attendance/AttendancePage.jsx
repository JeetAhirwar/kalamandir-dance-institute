import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
    CalendarCheckIcon,
    CheckCircle2Icon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ClipboardCheckIcon,
    DownloadIcon,
    GaugeIcon,
    HistoryIcon,
    Loader2Icon,
    SearchIcon,
    UsersIcon,
    XCircleIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useData } from "@/auth/AuthProvider";
import { useAsync } from "@/hooks";
import { downloadCsv, toCsv } from "@/lib/csv";
import { formatDateTime } from "@/lib/format";
import { cn } from "@/lib/utils";

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

/** Format a plain "HH:mm" studio time as "h:mm am/pm" (formatTime wants a Date). */
function fmtSlotTime(hhmm) {
    const m = toMin(hhmm);
    if (!Number.isFinite(m)) return "";
    const h24 = Math.floor(m / 60);
    const mins = String(m % 60).padStart(2, "0");
    const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
    return `${h12}:${mins} ${h24 < 12 ? "am" : "pm"}`;
}

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

    /* ------------------------------ header stats ----------------------------- */
    const [summaryDate] = useState(() => ymdOf(new Date()));
    const summary = useAsync(() => data.getClassDaySummary(summaryDate), [data, summaryDate]);

    /* ------------------------------ mark section ----------------------------- */
    const slots = useAsync(() => data.listClassSlots(), [data]);
    const activeSlots = useMemo(() => (slots.data ?? []).filter((s) => s.isActive), [slots.data]);

    const [slotId, setSlotId] = useState("");
    const [markDate, setMarkDate] = useState(() => ymdOf(new Date()));
    const [loadedQuery, setLoadedQuery] = useState(null); // { slotId, date } set by Load Students
    const [statuses, setStatuses] = useState({}); // memberId -> present|late|absent
    const [savingId, setSavingId] = useState(null);
    const [markAllChecked, setMarkAllChecked] = useState(false);

    // Auto-select the live (or next) slot and preload its roster, so the
    // Mark Attendance panel opens on whichever class is running right now.
    useEffect(() => {
        if (slotId || activeSlots.length === 0) return;
        const pick = pickLiveSlot(activeSlots);
        if (!pick) return;
        setSlotId(pick.id);
        setLoadedQuery({ slotId: pick.id, date: markDate });
        // Only on first load — don't re-trigger when markDate changes.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeSlots, slotId]);

    const roster = useAsync(
        () => (loadedQuery ? data.getClassRoster(loadedQuery.slotId, loadedQuery.date) : Promise.resolve(null)),
        [data, loadedQuery],
        { enabled: !!loadedQuery },
    );

    // Seed the status map from the roster whenever it loads.
    useEffect(() => {
        if (!roster.data?.students) return;
        const next = {};
        for (const s of roster.data.students) next[s.memberId] = s.attendanceStatus ?? "present";
        setStatuses(next);
        setMarkAllChecked(false);
    }, [roster.data]);

    const students = roster.data?.students ?? [];

    const handleLoad = () => {
        if (!slotId) return;
        setLoadedQuery({ slotId, date: markDate });
    };

    const persist = async (marks) => {
        try {
            const result = await data.markRosterAttendance({ slotId: loadedQuery.slotId, date: loadedQuery.date, marks });
            if (result.status === "ok") {
                toast.success(`Saved ${result.marked} ${result.marked === 1 ? "student" : "students"}`);
                roster.reload();
                summary.reload();
            }
            else {
                toast.error(result.message ?? "Could not save attendance.");
            }
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to save attendance.");
        }
    };

    const selectStatus = async (memberId, status) => {
        setStatuses((prev) => ({ ...prev, [memberId]: status }));
        setSavingId(memberId);
        await persist([{ memberId, status }]);
        setSavingId(null);
    };

    const markAll = async () => {
        setMarkAllChecked(true);
        const next = {};
        for (const s of students) next[s.memberId] = "present";
        setStatuses(next);
        await persist(students.map((s) => ({ memberId: s.memberId, status: "present" })));
    };

    const selectedSlot = activeSlots.find((s) => s.id === (loadedQuery?.slotId ?? slotId)) ?? null;

    /* ------------------------------- view section ---------------------------- */
    const [tab, setTab] = useState("view");
    const [viewSlotId, setViewSlotId] = useState("all");
    const [viewDate, setViewDate] = useState(() => ymdOf(new Date()));
    const [search, setSearch] = useState("");

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

    const slotNameOf = (row) => row.meta?.slotName ?? (row.classSlotId ? "Class" : "Walk-in");

    const handleExport = () => {
        if (filteredRows.length === 0) {
            toast.info("Nothing to export for this day.");
            return;
        }
        downloadCsv(`attendance-${viewDate}`, toCsv(filteredRows, [
            { header: "Student", accessor: (r) => r.memberName ?? "" },
            { header: "Student ID", accessor: (r) => r.memberCode ?? "" },
            { header: "Class Slot", accessor: (r) => slotNameOf(r) },
            { header: "Date", accessor: (r) => r.sessionDate ?? "" },
            { header: "Status", accessor: (r) => STATUS_META[r.attendanceStatus]?.label ?? "" },
            { header: "Marked By", accessor: (r) => r.scannerName ?? "" },
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

          <div className="grid gap-4 lg:grid-cols-[1fr_180px_auto] lg:items-end">
            <div className="space-y-1.5">
              <Label>Class Slot</Label>
              <Select value={slotId || "__none__"} onValueChange={(v) => setSlotId(v === "__none__" ? "" : v)} disabled={activeSlots.length === 0}>
                <SelectTrigger className="w-full"><SelectValue placeholder={slots.loading ? "Loading slots…" : "Select class slot"}/></SelectTrigger>
                <SelectContent>
                  {activeSlots.map((s) => (<SelectItem key={s.id} value={s.id}>
                      {s.name} · {fmtSlotTime(s.startTime)} – {fmtSlotTime(s.endTime)}
                    </SelectItem>))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="mark-date">Session Date</Label>
              <Input id="mark-date" type="date" value={markDate} onChange={(e) => setMarkDate(e.target.value)}/>
            </div>
            <Button className="h-10 w-full lg:w-auto" onClick={handleLoad} disabled={!slotId}>
              <UsersIcon className="size-4"/> Load Students
            </Button>
          </div>

          {/* Students panel */}
          <div className="rounded-xl border border-border/70">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/70 px-4 py-3">
              <div className="flex items-center gap-2 text-sm font-medium">
                <UsersIcon className="size-4 text-muted-foreground"/>
                Students <span className="text-muted-foreground">({students.length} loaded)</span>
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
                <p className="text-sm font-medium">Select a class slot and date to load students</p>
                <p className="text-xs text-muted-foreground">Students will appear here to mark their attendance.</p>
              </div>) : roster.loading ? (<div className="px-4 py-8 text-center text-sm text-muted-foreground">Loading students…</div>) : students.length === 0 ? (<div className="px-4 py-8 text-center text-sm text-muted-foreground">
                No students are enrolled in this slot yet. Add them from Class Slots → Roster.
              </div>) : (<ul className="divide-y divide-border/60">
                {students.map((s) => (<li key={s.memberId} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold uppercase text-muted-foreground">
                        {(s.fullName ?? "S").slice(0, 2)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{s.fullName}</p>
                        <p className="truncate text-xs text-muted-foreground">{s.memberCode ?? "—"}</p>
                      </div>
                      {savingId === s.memberId ? <Loader2Icon className="size-3.5 animate-spin text-muted-foreground"/> : null}
                    </div>
                    <div className="flex items-center gap-1.5">
                      {STATUS_ORDER.map((st) => {
                const meta = STATUS_META[st];
                const active = statuses[s.memberId] === st;
                return (<Button key={st} size="sm" variant={active ? "secondary" : "outline"} aria-pressed={active} className={cn("h-8 px-3", active && meta.chip)} onClick={() => selectStatus(s.memberId, st)}>
                              {meta.label}
                            </Button>);
            })}
                    </div>
                  </li>))}
              </ul>)}
          </div>

          {selectedSlot && loadedQuery ? (<p className="text-xs text-muted-foreground">
              {selectedSlot.instructorName ? <>Instructor: <span className="font-medium text-foreground">{selectedSlot.instructorName}</span></> : "No instructor assigned"}
            </p>) : null}
        </CardContent>
      </Card>

      {/* ------------------------------ View section ---------------------------- */}
      <Card className="graphite-surface border-border/70">
        <CardContent className="space-y-5 p-5">
          {/* Tabs */}
          <div className="flex items-center gap-1 rounded-lg border border-border/70 p-1" role="tablist" aria-label="Attendance view">
            <Button size="sm" role="tab" aria-selected={tab === "view"} variant={tab === "view" ? "secondary" : "ghost"} className="h-8 gap-2 px-3" onClick={() => setTab("view")}>
              <HistoryIcon className="size-4"/> View Attendance
            </Button>
            <Button size="sm" role="tab" aria-selected={tab === "stats"} variant={tab === "stats" ? "secondary" : "ghost"} className="h-8 gap-2 px-3" onClick={() => setTab("stats")}>
              <GaugeIcon className="size-4"/> Attendance Stats
            </Button>
          </div>

          {tab === "view" ? (<>
              {/* Filters */}
              <div className="grid gap-3 lg:grid-cols-[200px_auto_1fr_auto] lg:items-end">
                <div className="space-y-1.5">
                  <Label>Class Slot</Label>
                  <Select value={viewSlotId} onValueChange={setViewSlotId}>
                    <SelectTrigger className="w-full"><SelectValue placeholder="All Classes"/></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Classes</SelectItem>
                      {activeSlots.map((s) => (<SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>))}
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

              {/* Table */}
              {list.loading ? (<div className="px-2 py-8 text-center text-sm text-muted-foreground">Loading attendance…</div>) : filteredRows.length === 0 ? (<div className="px-2 py-10 text-center text-sm text-muted-foreground">
                  No attendance recorded for {formatDateTime(new Date(`${viewDate}T00:00:00`)).split(",")[0]}.
                </div>) : (<>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-10">#</TableHead>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Student ID</TableHead>
                          <TableHead>Class Slot</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Marked By</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredRows.map((row, index) => (<TableRow key={row.id}>
                            <TableCell className="text-sm text-muted-foreground tabular-nums">{index + 1}</TableCell>
                            <TableCell className="font-medium">{row.memberName ?? "Student"}</TableCell>
                            <TableCell className="text-muted-foreground">{row.memberCode ?? "—"}</TableCell>
                            <TableCell className="text-muted-foreground">{slotNameOf(row)}</TableCell>
                            <TableCell className="text-sm tabular-nums text-muted-foreground">{row.sessionDate ?? "—"}</TableCell>
                            <TableCell><StatusChip status={row.attendanceStatus}/></TableCell>
                            <TableCell className="text-muted-foreground">{row.scannerName ?? "—"}</TableCell>
                          </TableRow>))}
                      </TableBody>
                    </Table>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Showing {filteredRows.length} of {classRows.length} {classRows.length === 1 ? "student" : "students"}
                  </p>
                </>)}
            </>) : (<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Total Students" value={summaryData?.totalStudents ?? 0} icon={<UsersIcon className="size-4"/>} tone="neutral"/>
              <StatCard label="Present Today" value={summaryData?.presentToday ?? 0} icon={<CheckCircle2Icon className="size-4"/>} tone="present"/>
              <StatCard label="Absent Today" value={summaryData?.absentToday ?? 0} icon={<XCircleIcon className="size-4"/>} tone="absent"/>
              <StatCard label="Attendance Rate" value={`${summaryData?.attendanceRate ?? 0}%`} icon={<GaugeIcon className="size-4"/>} tone="rate"/>
            </div>)}
        </CardContent>
      </Card>

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
