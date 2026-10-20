import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ArchiveIcon, ArchiveRestoreIcon, CalendarRangeIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, Loader2Icon, MoreVerticalIcon, PencilIcon, PlusIcon, SearchIcon, UserIcon, UsersIcon, XIcon, } from "lucide-react";
import { EmptyState, ErrorState, Skeleton, TableSkeleton, Stagger } from "@/components/shared/States";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAuth, useData } from "@/auth/AuthProvider";
import { useAsync, useDebounced, useSubmitGuard } from "@/hooks";
import { format12h, initialsOf } from "@/lib/format";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";

/** Weekday → short chip label (indexed by JS weekday: 0 = Sunday). */
const DAY_CHIPS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const PAGE_SIZE = 5;
const EMPTY_SLOT = {
    name: "",
    description: "",
    weekdays: [1, 3, 5],
    startTime: "17:00",
    endTime: "18:00",
    capacity: "",
    instructorId: "",
    isActive: true,
};
/* ------------------------------------------------------------------ */
/*  Create / edit a recurring class slot                                */
/* ------------------------------------------------------------------ */
export function SlotFormDialog({ open, onOpenChange, slot, onSave }) {
    const data = useData();
    const staff = useAsync(() => data.listStaff(true), [data], { enabled: open });
    const [submitting, run] = useSubmitGuard();
    const [values, setValues] = useState(EMPTY_SLOT);
    useEffect(() => {
        if (!open)
            return;
        if (slot) {
            setValues({
                name: slot.name ?? "",
                description: slot.description ?? "",
                weekdays: slot.weekdays ?? [],
                startTime: slot.startTime ?? "17:00",
                endTime: slot.endTime ?? "18:00",
                capacity: slot.capacity ?? "",
                instructorId: slot.instructorId ?? "",
                isActive: slot.isActive !== false,
            });
        }
        else {
            setValues(EMPTY_SLOT);
        }
    }, [open, slot]);
    const trainers = (staff.data ?? []).filter((s) => s.role === "trainer" && s.employmentStatus !== "resigned");
    const set = (patch) => setValues((v) => ({ ...v, ...patch }));
    const toggleDay = (d) => set((v) => ({
        weekdays: v.weekdays.includes(d) ? v.weekdays.filter((x) => x !== d) : [...v.weekdays, d],
    }));
    const valid = values.name.trim() && values.weekdays.length > 0;
    const submit = () => {
        if (!valid)
            return;
        run(async () => {
            try {
                await onSave({
                    name: values.name.trim(),
                    description: values.description.trim() || null,
                    weekdays: [...values.weekdays].sort(),
                    startTime: values.startTime,
                    endTime: values.endTime,
                    capacity: values.capacity === "" ? null : Number(values.capacity),
                    instructorId: values.instructorId || null,
                    isActive: values.isActive,
                });
            }
            catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to save this slot.");
            }
        });
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{slot ? "Edit class slot" : "New class slot"}</DialogTitle>
          <DialogDescription>
            A recurring batch (e.g. "Morning Ballet · Mon/Wed/Fri 5–6 PM"). Assign an instructor so only they can mark it.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="slot-name">Slot name</Label>
            <Input id="slot-name" placeholder="e.g. Morning Ballet" value={values.name} onChange={(e) => set({ name: e.target.value })}/>
          </div>

          <div className="space-y-1.5">
            <Label>Weekdays</Label>
            <div className="flex flex-wrap gap-1.5">
              {DAY_CHIPS.map((label, d) => (<button key={label} type="button" onClick={() => toggleDay(d)} className={cn("h-9 min-w-11 rounded-md border px-2 text-xs font-medium transition-colors", values.weekdays.includes(d)
                    ? "border-km-gold/60 bg-km-gold/15 text-foreground"
                    : "border-input text-muted-foreground hover:bg-secondary")} aria-pressed={values.weekdays.includes(d)}>
                  {label}
                </button>))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="slot-start">Start</Label>
              <Input id="slot-start" type="time" value={values.startTime} onChange={(e) => set({ startTime: e.target.value })}/>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="slot-end">End</Label>
              <Input id="slot-end" type="time" value={values.endTime} onChange={(e) => set({ endTime: e.target.value })}/>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="slot-cap">Capacity (blank = unlimited)</Label>
              <Input id="slot-cap" type="number" min="1" placeholder="Unlimited" value={values.capacity} onChange={(e) => set({ capacity: e.target.value })}/>
            </div>
            <div className="space-y-1.5">
              <Label>Instructor</Label>
              <Select value={values.instructorId || "__none__"} onValueChange={(v) => set({ instructorId: v === "__none__" ? "" : v })}>
                <SelectTrigger className="w-full"><SelectValue placeholder="No instructor"/></SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">No instructor</SelectItem>
                  {trainers.map((t) => (<SelectItem key={t.id} value={t.id}>{t.fullName}</SelectItem>))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={values.isActive ? "active" : "archived"} onValueChange={(v) => set({ isActive: v === "active" })}>
              <SelectTrigger className="w-full"><SelectValue/></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="archived">Archived</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={submit} disabled={!valid || submitting}>
            {submitting ? <Loader2Icon className="size-4 animate-spin"/> : null}
            {slot ? "Save changes" : "Create slot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>);
}
/* ------------------------------------------------------------------ */
/*  Roster — enroll / remove students from a slot                       */
/* ------------------------------------------------------------------ */
export function RosterDialog({ open, onOpenChange, slot, onChanged }) {
    const data = useData();
    const { session } = useAuth();
    const canManage = can(session?.profile.role, "slots.manage");
    const roster = useAsync(() => (slot ? data.listSlotStudents(slot.id) : Promise.resolve([])), [data, slot?.id, open], { enabled: open });
    const allMembers = useAsync(() => data.listAllMembers(), [data], { enabled: open });
    const [query, setQuery] = useState("");
    const debounced = useDebounced(query, 250);
    useEffect(() => {
        if (!open)
            setQuery("");
    }, [open]);
    const enrolledIds = useMemo(() => new Set((roster.data ?? []).map((r) => r.memberId)), [roster.data]);
    const candidates = useMemo(() => {
        const q = debounced.trim().toLowerCase();
        return (allMembers.data ?? [])
            .filter((m) => m.status === "active")
            .filter((m) => !enrolledIds.has(m.id))
            .filter((m) => !q || m.fullName.toLowerCase().includes(q) || m.memberCode.toLowerCase().includes(q))
            .slice(0, 40);
    }, [allMembers.data, debounced, enrolledIds]);
    const add = async (memberId) => {
        try {
            await data.enrollSlotStudent(slot.id, memberId);
            roster.reload();
            onChanged?.();
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to add this student.");
        }
    };
    const remove = async (enrollmentId) => {
        try {
            await data.unenrollSlotStudent(enrollmentId);
            roster.reload();
            onChanged?.();
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to remove this student.");
        }
    };
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Roster — {slot?.name}</DialogTitle>
          <DialogDescription>Students scheduled for this batch. Mark attendance from the Mark Attendance page.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="max-h-56 space-y-1 overflow-y-auto">
            {roster.loading ? (<TableSkeleton rows={3} cols={2}/>) : (roster.data ?? []).length === 0 ? (<p className="px-1 py-3 text-sm text-muted-foreground">No students enrolled yet.</p>) : (roster.data ?? []).map((r) => (<div key={r.id} className="flex items-center justify-between rounded-md border border-border/60 px-3 py-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{r.memberName ?? "Student"}</p>
                  <p className="text-xs text-muted-foreground">{r.memberCode}</p>
                </div>
                {canManage ? (<Button variant="ghost" size="icon" onClick={() => remove(r.id)} aria-label="Remove from slot">
                    <XIcon className="size-4 text-muted-foreground"/>
                  </Button>) : null}
              </div>))}
          </div>

          {canManage ? (<div className="space-y-2">
            <div className="relative">
              <SearchIcon className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"/>
              <Input placeholder="Search active students to add…" className="pl-8" value={query} onChange={(e) => setQuery(e.target.value)}/>
            </div>
            <div className="max-h-48 space-y-1 overflow-y-auto">
              {allMembers.loading ? (<TableSkeleton rows={3} cols={2}/>) : candidates.length === 0 ? (<p className="px-1 py-2 text-sm text-muted-foreground">No matching students to add.</p>) : (candidates.map((m) => (<div key={m.id} className="flex items-center justify-between rounded-md px-2 py-1.5 hover:bg-secondary/60">
                  <div className="min-w-0">
                    <p className="truncate text-sm">{m.fullName}</p>
                    <p className="text-xs text-muted-foreground">{m.memberCode}</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => add(m.id)}>Add</Button>
                </div>)))}
            </div>
          </div>) : null}
        </div>
      </DialogContent>
    </Dialog>);
}
/* ------------------------------------------------------------------ */
/*  The "Class Slots" card — shown on the merged Classes & Schedule    */
/*  page, right under the weekly timetable.                            */
/* ------------------------------------------------------------------ */
function SlotRow({ slot, canManage, onRoster, onEdit, onArchive, onRestore, }) {
    return (<TableRow className={cn(!slot.isActive && "opacity-70")}>
      <TableCell>
        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg border border-km-gold/25 bg-km-gold/10 text-km-gold">
            <CalendarRangeIcon className="size-4"/>
          </span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">
              {slot.name}
              {slot.capacity != null ? (<span className="ml-1 text-xs font-normal text-muted-foreground">· cap {slot.capacity}</span>) : null}
            </p>
            <p className="truncate text-xs text-muted-foreground">{slot.description || slot.notes || "Recurring batch"}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-wrap gap-1">
          {(slot.weekdays ?? []).length === 0 ? (<span className="text-sm text-muted-foreground">—</span>) : ([...slot.weekdays].sort((a, b) => a - b).map((d) => (<span key={d} className="inline-flex h-6 min-w-10 items-center justify-center rounded-md border border-primary/20 bg-primary/10 px-1.5 text-[11px] font-semibold text-primary">
                {DAY_CHIPS[d] ?? d}
              </span>)))}
        </div>
      </TableCell>
      <TableCell className="tabular text-sm text-muted-foreground">
        {slot.startTime && slot.endTime ? (<>
            {format12h(slot.startTime)} – {format12h(slot.endTime)}
          </>) : "—"}
      </TableCell>
      <TableCell>
        {slot.instructorName ? (<div className="flex items-center gap-2">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-semibold text-secondary-foreground">
              {initialsOf(slot.instructorName)}
            </span>
            <span className="text-sm">{slot.instructorName}</span>
          </div>) : (<div className="flex items-center gap-2 text-muted-foreground">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted">
              <UserIcon className="size-3.5"/>
            </span>
            <span className="text-sm">Unassigned</span>
          </div>)}
      </TableCell>
      <TableCell className="tabular text-sm">
        {slot.enrolledCount ?? 0}
        {slot.capacity != null ? <span className="text-muted-foreground">/{slot.capacity}</span> : null}
      </TableCell>
      <TableCell>
        {slot.isActive ? (<Badge variant="secondary" className="border-success/30 bg-success/10 text-success">
            <span className="size-1.5 rounded-full bg-success"/> Active
          </Badge>) : (<Badge variant="outline">Archived</Badge>)}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-0.5">
          <Button variant="ghost" size="icon-sm" aria-label={`View roster for ${slot.name}`} onClick={() => onRoster(slot)}>
            <EyeIcon className="size-4"/>
          </Button>
          {canManage ? (<Button variant="ghost" size="icon-sm" aria-label={`Edit ${slot.name}`} onClick={() => onEdit(slot)}>
              <PencilIcon className="size-4"/>
            </Button>) : null}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${slot.name}`}>
                <MoreVerticalIcon className="size-4"/>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRoster(slot)}>
                <UsersIcon className="size-4"/> View roster
              </DropdownMenuItem>
              {canManage ? (<DropdownMenuItem onClick={() => onEdit(slot)}>
                  <PencilIcon className="size-4"/> Edit slot
                </DropdownMenuItem>) : null}
              {canManage && slot.isActive ? (<DropdownMenuItem variant="destructive" onClick={() => onArchive(slot)}>
                  <ArchiveIcon className="size-4"/> Archive slot
                </DropdownMenuItem>) : null}
              {canManage && !slot.isActive ? (<DropdownMenuItem onClick={() => onRestore(slot)}>
                  <ArchiveRestoreIcon className="size-4"/> Restore slot
                </DropdownMenuItem>) : null}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>);
}
export function ClassSlotsSection({ sectionRef }) {
    const data = useData();
    const { session } = useAuth();
    const canManage = can(session?.profile.role, "slots.manage");
    const slots = useAsync(() => data.listClassSlots(), [data]);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [rosterFor, setRosterFor] = useState(null);
    const [page, setPage] = useState(1);

    const save = async (input) => {
        try {
            if (editing) {
                await data.updateClassSlot(editing.id, input);
                toast.success("Slot updated");
            }
            else {
                await data.createClassSlot(input);
                toast.success(`${input.name} created`);
            }
            setFormOpen(false);
            setEditing(null);
            slots.reload();
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to save this slot.");
        }
    };
    const archive = async (slot) => {
        try {
            await data.archiveClassSlot(slot.id);
            toast.success(`${slot.name} archived`);
            slots.reload();
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to archive this slot.");
        }
    };
    const restore = async (slot) => {
        try {
            await data.updateClassSlot(slot.id, { isActive: true });
            toast.success(`${slot.name} restored`);
            slots.reload();
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to restore this slot.");
        }
    };
    const openNew = () => {
        setEditing(null);
        setFormOpen(true);
    };
    const openEdit = (slot) => {
        setEditing(slot);
        setFormOpen(true);
    };

    const rows = slots.data ?? [];
    const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
    const current = Math.min(page, pageCount);
    const pageRows = rows.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE);
    const fromIndex = rows.length === 0 ? 0 : (current - 1) * PAGE_SIZE + 1;
    const toIndex = (current - 1) * PAGE_SIZE + pageRows.length;

    return (<section ref={sectionRef} id="class-slots" aria-labelledby="class-slots-heading" className="scroll-mt-24 overflow-hidden rounded-xl border border-border/70 bg-card/60 graphite-surface">
      {/* Section head */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/60 px-4 py-4 sm:px-5">
        <div className="flex items-start gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-km-gold/30 bg-km-gold/10 text-km-gold">
            <CalendarRangeIcon className="size-5"/>
          </span>
          <div className="min-w-0">
            <h2 id="class-slots-heading" className="font-display text-lg font-semibold tracking-tight">
              Class Slots
            </h2>
            <p className="max-w-2xl text-xs text-muted-foreground sm:text-sm">
              Recurring batches with weekdays, time and an assigned instructor. Instructors mark attendance only for their own slots.
            </p>
          </div>
        </div>
        {canManage ? (<Button onClick={openNew}>
            <PlusIcon className="size-4"/> New Slot
          </Button>) : null}
      </div>

      {slots.loading ? (<div className="space-y-3 p-4">
          <Skeleton className="h-10 w-full"/>
          <Skeleton className="h-10 w-full"/>
          <Skeleton className="h-10 w-2/3"/>
        </div>) : slots.error ? (<ErrorState title="Unable to load class slots" message={slots.error} onRetry={slots.reload}/>) : rows.length === 0 ? (<div className="p-4">
          <EmptyState icon={<CalendarRangeIcon className="size-5"/>} title="No class slots yet" description="Create your first batch (e.g. Morning Ballet · Mon/Wed/Fri) to start marking attendance." action={canManage ? (<Button onClick={openNew}><PlusIcon className="size-4"/> New Slot</Button>) : undefined}/>
        </div>) : (<>
          <Stagger>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="min-w-[880px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Slot Name</TableHead>
                      <TableHead>Days</TableHead>
                      <TableHead>Time</TableHead>
                      <TableHead>Instructor</TableHead>
                      <TableHead>Enrolled</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pageRows.map((slot) => (<SlotRow key={slot.id} slot={slot} canManage={canManage} onRoster={setRosterFor} onEdit={openEdit} onArchive={archive} onRestore={restore}/>))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Stagger>

          {/* Footer — count + pagination */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-4 py-3 sm:px-5">
            <p className="text-sm text-muted-foreground">
              Showing <span className="font-medium text-foreground tabular">{fromIndex}–{toIndex}</span> of{" "}
              <span className="font-medium text-foreground tabular">{rows.length}</span> slot{rows.length === 1 ? "" : "s"}
            </p>
            <div className="flex items-center gap-1.5">
              <Button size="icon-sm" variant="outline" aria-label="Previous page" disabled={current <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
                <ChevronLeftIcon/>
              </Button>
              <span className="flex size-8 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground tabular">
                {current}
              </span>
              <Button size="icon-sm" variant="outline" aria-label="Next page" disabled={current >= pageCount} onClick={() => setPage((p) => Math.min(pageCount, p + 1))}>
                <ChevronRightIcon/>
              </Button>
            </div>
          </div>
        </>)}

      <SlotFormDialog open={formOpen} onOpenChange={setFormOpen} slot={editing} onSave={save}/>
      <RosterDialog open={!!rosterFor} onOpenChange={(o) => !o && setRosterFor(null)} slot={rosterFor} onChanged={() => slots.reload()}/>
    </section>);
}
