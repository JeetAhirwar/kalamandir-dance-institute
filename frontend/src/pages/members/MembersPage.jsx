import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { ArrowDownIcon, ArrowUpIcon, ChevronLeftIcon, ChevronRightIcon, EyeIcon, MoreHorizontalIcon, PencilIcon, PlusIcon, SearchIcon, Trash2Icon, UserCheckIcon, UserRoundPlusIcon, UserXIcon, UsersIcon, } from "lucide-react";
import { PageHeader } from "@/components/shared/PageHeader";
import { EmptyState, ErrorState, SearchEmptyState, TableSkeleton, Stagger } from "@/components/shared/States";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { SmartImage } from "@/components/shared/SmartImage";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger, } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, } from "@/components/ui/table";
import { useAuth, useData } from "@/auth/AuthProvider";
import { useAsync, useDebounced } from "@/hooks";
import { MEMBER_FILTER_LABELS, PAYMENT_METHOD_LABELS, formatDate } from "@/lib/format";
import { can } from "@/lib/permissions";
import { cn } from "@/lib/utils";
import { MemberFormDialog } from "./MemberFormDialog";
import { ConfirmActionDialog } from "./ConfirmActionDialog";
const PAGE_SIZE = 10;
const STATUS_FILTERS = [
    "all",
    "active",
    "expiring_soon",
    "expired",
    "suspended",
    "inactive",
];
const SORT_OPTIONS = [
    { value: "created", label: "Recently added" },
    { value: "name", label: "Name" },
    { value: "joined", label: "Join date" },
    { value: "expiry", label: "Expiry date" },
];
/** "kitni class hui / bachi" — attended vs paid quota, shown as a compact stack.
 *  Colour rule: 4+ left green · 2–3 yellow · 1 or 0 red. */
function ClassesCell({ member }) {
    const q = member.quota;
    if (!q || q.status === "none") {
        return <span className="text-muted-foreground">—</span>;
    }
    return <span className="text-sm tabular">{q.attended} / {q.quota}</span>;
}
/** Bachi hui classes (remaining quota) — a tinted chip, same colour rule as
 *  the roster quota: 4+ left green · 2–3 yellow · 0–1 red (over/expired red). */
function ClassLeftCell({ member }) {
    const q = member.quota;
    if (!q || q.status === "none") {
        return <span className="text-muted-foreground">—</span>;
    }
    const tone = q.status === "exceeded" || q.status === "expired" || q.remaining < 2
        ? "border-destructive/30 bg-destructive/10 text-destructive"
        : q.remaining < 4
            ? "border-warning/30 bg-warning/10 text-warning"
            : "border-success/30 bg-success/10 text-success";
    const label = q.status === "exceeded"
        ? `${q.exceeded} over`
        : q.status === "expired"
            ? "0 left"
            : `${q.remaining} left`;
    return <Badge variant="outline" className={cn("font-medium tabular", tone)}>{label}</Badge>;
}
export function MembersPage() {
    const data = useData();
    const { session } = useAuth();
    const role = session?.profile.role;
    const canCreate = can(role, "members.create");
    const canEdit = can(role, "members.edit");
    const canDelete = can(role, "members.delete");
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState("");
    const debouncedSearch = useDebounced(search, 350);
    // Deep link: /members?status=active (dashboard stat cards) presets the filter.
    const [status, setStatus] = useState(() => {
        const preset = searchParams.get("status");
        return preset && STATUS_FILTERS.includes(preset) ? preset : "all";
    });
    const [planId, setPlanId] = useState("all");
    const [sort, setSort] = useState("created");
    const [dir, setDir] = useState("desc");
    const [page, setPage] = useState(1);
    const [formOpen, setFormOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const plans = useAsync(() => data.listPlans(), [data]);
    const members = useAsync(() => data.listMembers({
        search: debouncedSearch.trim() || undefined,
        status,
        planId: planId === "all" ? undefined : planId,
        sort,
        dir,
        page,
        pageSize: PAGE_SIZE,
    }), [data, debouncedSearch, status, planId, sort, dir, page]);
    // Reset to the first page whenever the filters change.
    useEffect(() => {
        setPage(1);
    }, [debouncedSearch, status, planId, sort, dir]);
    // Deep link: /members?new=1 auto-opens the add dialog (dashboard quick action).
    // The param is kept while the dialog should be open so a page-transition remount
    // re-opens it; it is cleared only once the dialog is dismissed (or not permitted).
    useEffect(() => {
        if (!session)
            return; // auth still restoring — never consume the param early
        if (searchParams.get("new") !== "1")
            return;
        if (canCreate) {
            setEditing(null);
            setFormOpen(true);
        }
        else {
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams, canCreate, session]);
    const handleFormOpenChange = (open) => {
        setFormOpen(open);
        if (!open && searchParams.has("new")) {
            setSearchParams({}, { replace: true });
        }
    };
    const hasFilters = debouncedSearch.trim() !== "" || status !== "all" || planId !== "all";
    const clearFilters = () => {
        setSearch("");
        setStatus("all");
        setPlanId("all");
        setSort("created");
        setDir("desc");
    };
    const openCreate = () => {
        setEditing(null);
        setFormOpen(true);
    };
    const openEdit = (member) => {
        setEditing(member);
        setFormOpen(true);
    };
    const handleSave = async (payload) => {
        try {
            if (payload.mode === "create") {
                await data.createMember(payload.input);
                toast.success(`${payload.input.fullName} added`);
            }
            else if (editing) {
                await data.updateMember(editing.id, payload.input);
                toast.success(`${payload.input.fullName ?? editing.fullName} updated`);
            }
            members.reload();
            return true;
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to save this student.");
            return false;
        }
    };
    const handleToggleStatus = async (member) => {
        const next = member.status === "active" ? "inactive" : "active";
        try {
            await data.setMemberStatus(member.id, next);
            toast.success(next === "active" ? `${member.fullName} reactivated` : `${member.fullName} deactivated`);
            members.reload();
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to change the student status.");
        }
    };
    const handleDelete = async () => {
        if (!deleting)
            return false;
        try {
            await data.deleteMember(deleting.id);
            toast.success(`${deleting.fullName} deleted`);
            members.reload();
            return true;
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to delete this student.");
            return false;
        }
    };
    const rows = members.data?.items ?? [];
    const total = members.data?.total ?? 0;
    const currentPage = members.data?.page ?? page;
    const pageSize = members.data?.pageSize ?? PAGE_SIZE;
    const rangeFrom = total === 0 ? 0 : (currentPage - 1) * pageSize + 1;
    const rangeTo = Math.min(total, currentPage * pageSize);
    const header = (<PageHeader title="Students" description="Your student directory — memberships, QR cards and payment history in one place." actions={canCreate ? (<Button onClick={openCreate}>
            <PlusIcon className="size-4"/> Add student
          </Button>) : null}/>);
    return (<div className="space-y-6">
      {header}

      {/* Toolbar — search, filters and sort in one card, matching the plans page. */}
      <div className="flex flex-col gap-3 rounded-xl border border-km-gold/25 bg-card/70 p-3 sm:flex-row sm:items-center sm:gap-3 sm:p-4">
        {/* Search */}
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"/>
          <Input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search name, phone or Student ID…" className="h-9 border-km-gold/25 bg-background/60 pl-9 focus-visible:border-km-gold" aria-label="Search students"/>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <Select value={status} onValueChange={(value) => setStatus(value)}>
            <SelectTrigger size="sm" className="border-km-gold/25 bg-background/60" aria-label="Filter by status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent position="popper" align="end" className="min-w-40">
              {STATUS_FILTERS.map((option) => (<SelectItem key={option} value={option}>
                  {MEMBER_FILTER_LABELS[option]}
                </SelectItem>))}
            </SelectContent>
          </Select>

          <Select value={planId} onValueChange={setPlanId}>
            <SelectTrigger size="sm" className="border-km-gold/25 bg-background/60" aria-label="Filter by plan">
              <SelectValue placeholder="All plans"/>
            </SelectTrigger>
            <SelectContent position="popper" align="end" className="min-w-44">
              <SelectItem value="all">All plans</SelectItem>
              {(plans.data ?? []).map((plan) => (<SelectItem key={plan.id} value={plan.id}>
                  {plan.name}
                </SelectItem>))}
            </SelectContent>
          </Select>

          {/* Sort — field + direction as one compact group. */}
          <div className="flex items-center gap-1 rounded-lg border border-km-gold/25 bg-background/60 p-1">
            <Select value={sort} onValueChange={(value) => setSort(value)}>
              <SelectTrigger size="sm" className="border-0 bg-transparent px-2 shadow-none focus-visible:ring-0" aria-label="Sort students">
                <SelectValue />
              </SelectTrigger>
              <SelectContent position="popper" align="end" className="min-w-40">
                {SORT_OPTIONS.map((option) => (<SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>))}
              </SelectContent>
            </Select>
            <Button variant="ghost" size="icon-sm" className="size-7 text-muted-foreground" aria-label={dir === "asc" ? "Sort ascending (switch to descending)" : "Sort descending (switch to ascending)"} onClick={() => setDir((current) => (current === "asc" ? "desc" : "asc"))}>
              {dir === "asc" ? <ArrowUpIcon className="size-4"/> : <ArrowDownIcon className="size-4"/>}
            </Button>
          </div>

          {hasFilters ? (<Button variant="ghost" size="sm" className="text-muted-foreground" onClick={clearFilters}>
              Clear filters
            </Button>) : null}
        </div>
      </div>

      {/* Table */}
      <Stagger>
        <Card className="graphite-surface gap-0 overflow-hidden border-border/70 py-0">
          {members.error ? (<div className="p-4">
              <ErrorState title="Unable to load students" message={members.error} onRetry={members.reload}/>
            </div>) : members.loading && !members.data ? (<TableSkeleton rows={6} cols={5}/>) : rows.length === 0 ? (<div className="p-4">
              {hasFilters ? (<SearchEmptyState query={debouncedSearch.trim()}/>) : (<EmptyState icon={<UsersIcon className="size-5"/>} title="No students yet" description="Add your first student — their QR membership card is generated automatically." action={canCreate ? (<Button size="sm" onClick={openCreate}>
                        <UserRoundPlusIcon className="size-4"/> Add student
                      </Button>) : undefined}/>)}
            </div>) : (<>
              <div className={cn("transition-opacity", members.loading && "pointer-events-none opacity-60")}>
                <Table className="min-w-[900px] table-fixed">
                  <TableHeader>
                    <TableRow className="h-11">
                      <TableHead className="w-[6%] px-3 align-middle">Sr. no.</TableHead>
                      <TableHead className="w-[24%] px-3 align-middle">Student</TableHead>
                      <TableHead className="w-[10%] px-3 align-middle">Status</TableHead>
                      <TableHead className="w-[11%] px-3 align-middle">Classes</TableHead>
                      <TableHead className="w-[11%] px-3 align-middle">Class Left</TableHead>
                      <TableHead className="w-[16%] px-3 align-middle">Plan</TableHead>
                      <TableHead className="w-[13%] px-3 align-middle">Payment Mode</TableHead>
                      <TableHead className="w-[9%] px-3 text-right align-middle">
                        <span className="sr-only">Actions</span>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rows.map((member, index) => (<TableRow key={member.id} className="h-16 cursor-pointer" onClick={() => navigate(`/members/${member.id}`)}>
                        <TableCell className="px-3 align-middle text-sm tabular text-muted-foreground">
                          {(currentPage - 1) * pageSize + index + 1}
                        </TableCell>
                        <TableCell className="px-3 align-middle">
                          <div className="flex items-center gap-3">
                            <SmartImage src={member.photoUrl} name={member.fullName} className="size-11 shrink-0"/>
                            <div className="min-w-0">
                              <Link to={`/members/${member.id}`} onClick={(event) => event.stopPropagation()} className="block truncate text-sm font-medium hover:underline">
                                {member.fullName}
                              </Link>
                              <p className="truncate text-xs text-muted-foreground">{member.memberCode}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-3 align-middle">
                          <StatusBadge status={member.effectiveStatus}/>
                        </TableCell>
                        <TableCell className="px-3 text-sm align-middle">
                          <ClassesCell member={member}/>
                        </TableCell>
                        <TableCell className="px-3 text-sm align-middle">
                          <ClassLeftCell member={member}/>
                        </TableCell>
                        <TableCell className="px-3 align-middle">
                          {member.planName ? (<div className="min-w-0">
                              <p className="truncate text-sm leading-tight">{member.planName}</p>
                              <p className="truncate text-xs leading-tight text-muted-foreground">ends {formatDate(member.endDate)}</p>
                            </div>) : (<span className="text-muted-foreground">—</span>)}
                        </TableCell>
                        <TableCell className="px-3 text-sm align-middle text-muted-foreground">
                          {member.paymentMethod
                            ? (PAYMENT_METHOD_LABELS[member.paymentMethod] ?? member.paymentMethod)
                            : "—"}
                        </TableCell>
                        <TableCell className="px-3 text-right align-middle">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon-xs" aria-label={`Actions for ${member.fullName}`} className="ml-auto" onClick={(event) => event.stopPropagation()}>
                                <MoreHorizontalIcon />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" sideOffset={6} onClick={(event) => event.stopPropagation()}>
                              <DropdownMenuItem onSelect={() => navigate(`/members/${member.id}`)}>
                                <EyeIcon /> View profile
                              </DropdownMenuItem>
                              {canEdit ? (<>
                                  <DropdownMenuItem onSelect={() => openEdit(member)}>
                                    <PencilIcon /> Edit student
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onSelect={() => void handleToggleStatus(member)}>
                                    {member.status === "active" ? <UserXIcon /> : <UserCheckIcon />}
                                    {member.status === "active" ? "Deactivate" : "Activate"}
                                  </DropdownMenuItem>
                                </>) : null}
                              {canDelete ? (<>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem variant="destructive" onSelect={() => setDeleting(member)}>
                                    <Trash2Icon /> Delete student
                                  </DropdownMenuItem>
                                </>) : null}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border/70 px-4 py-3">
                <p className="text-xs text-muted-foreground">
                  Showing {rangeFrom}–{rangeTo} of {total} {total === 1 ? "student" : "students"}
                </p>
                <div className="flex items-center gap-1">
                  <Button variant="outline" size="sm" disabled={currentPage <= 1 || members.loading} onClick={() => setPage(currentPage - 1)}>
                    <ChevronLeftIcon className="size-4"/> Prev
                  </Button>
                  <Button variant="outline" size="sm" disabled={rangeTo >= total || members.loading} onClick={() => setPage(currentPage + 1)}>
                    Next <ChevronRightIcon className="size-4"/>
                  </Button>
                </div>
              </div>
            </>)}
        </Card>
      </Stagger>

      <MemberFormDialog open={formOpen} onOpenChange={handleFormOpenChange} member={editing} plans={plans.data ?? []} onSave={handleSave}/>

      <ConfirmActionDialog open={deleting !== null} onOpenChange={(open) => {
            if (!open)
                setDeleting(null);
        }} icon={Trash2Icon} title={`Delete ${deleting?.fullName ?? "student"}?`} description="This permanently removes the student, their memberships, attendance and payment records. This action cannot be undone." cancelLabel="Keep student" confirmLabel="Delete student" onConfirm={handleDelete}/>
    </div>);
}
