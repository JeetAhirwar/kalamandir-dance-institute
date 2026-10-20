import { useEffect, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { PhotoPicker } from "@/components/shared/PhotoPicker";
import { useData } from "@/auth/AuthProvider";
import { useAsync, useSubmitGuard } from "@/hooks";
import { toDateOnly } from "@/lib/datetime";
import { durationLabel, formatINR, PAYMENT_METHOD_LABELS, timeSlotLabel } from "@/lib/format";
import { memberFormSchema } from "@/lib/validation";
const GENDER_OPTIONS = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "other", label: "Other" },
    { value: "prefer_not_to_say", label: "Prefer not to say" },
];
const PAYMENT_METHODS = ["cash", "upi", "card", "bank_transfer", "other"];
function emptyValues() {
    const today = toDateOnly(new Date());
    return {
        fullName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        // NaN renders an empty number input and validates as "not set".
        age: Number.NaN,
        address: "",
        emergencyContactName: "",
        emergencyContactPhone: "",
        joinDate: today,
        planId: "",
        membershipStart: today,
        loginPassword: "",
        // Hidden flag: "create" requires a login password, "edit" does not.
        mode: "create",
        photoUrl: "",
        notes: "",
        // NaN renders an empty number input and validates as "not set".
        plannedHoursPerDay: Number.NaN,
        // "" = no preferred slot (zod → null before hitting the API).
        preferredSlot: "",
        // Selected tag ids (student labels).
        tagIds: [],
    };
}
function trimOrNull(value) {
    const trimmed = value?.trim();
    return trimmed ? trimmed : null;
}
/** Concrete identity fields — required by create, all optional on update. */
function toIdentityInput(values) {
    return {
        fullName: values.fullName,
        email: trimOrNull(values.email),
        phone: values.phone,
        photoUrl: trimOrNull(values.photoUrl),
        dateOfBirth: values.dateOfBirth ? values.dateOfBirth : null,
        // Age in years (whole number, or null when not set).
        age: typeof values.age === "number" && Number.isFinite(values.age) && values.age > 0
            ? Math.trunc(values.age)
            : null,
        gender: values.gender ?? null,
        address: trimOrNull(values.address),
        emergencyContactName: trimOrNull(values.emergencyContactName),
        plannedHoursPerDay: typeof values.plannedHoursPerDay === "number" && values.plannedHoursPerDay > 0
            ? values.plannedHoursPerDay
            : null,
        preferredSlot: trimOrNull(values.preferredSlot),
        tagIds: Array.isArray(values.tagIds) ? values.tagIds : [],
        emergencyContactPhone: values.emergencyContactPhone ? values.emergencyContactPhone : null,
        joinDate: values.joinDate,
        notes: trimOrNull(values.notes),
    };
}
function toUpdateInput(values) {
    return toIdentityInput(values);
}
function toCreateInput(values, method, recordPayment) {
    const amount = values.initialPayment;
    return {
        ...toIdentityInput(values),
        planId: values.planId,
        membershipStart: values.membershipStart,
        loginPassword: trimOrNull(values.loginPassword) ?? undefined,
        initialPayment: recordPayment && typeof amount === "number" && amount > 0
            ? { amount, method, paymentDate: toDateOnly(new Date()) }
            : null,
    };
}
/**
 * Add / Edit student dialog.
 *
 * CREATE mode additionally assigns the first membership (plan + start date)
 * and can record the opening payment. EDIT mode only touches the student's
 * personal fields — memberships are managed via renew on the detail page.
 */
export function MemberFormDialog({ open, onOpenChange, member, plans, onSave, }) {
    const [submitting, run] = useSubmitGuard();
    const [recordPayment, setRecordPayment] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const { register, handleSubmit, control, reset, watch, setValue, formState: { errors }, } = useForm({
        resolver: zodResolver(memberFormSchema),
        defaultValues: emptyValues(),
    });
    const photoValue = watch("photoUrl") ?? "";
    const memberName = watch("fullName") || "Student";
    const isEdit = member !== null;
    /** Plans offered in the picker — active first; fall back to everything. */
    const planChoices = useMemo(() => {
        const active = plans.filter((plan) => plan.isActive);
        return active.length > 0 ? active : plans;
    }, [plans]);
    /** Currently picked plan — powers the "total" read-out under the picker. */
    const watchedPlanId = watch("planId");
    const selectedPlan = useMemo(
        () => planChoices.find((plan) => plan.id === watchedPlanId) ?? null,
        [planChoices, watchedPlanId],
    );
    const data = useData();
    /** Gym slot schedule — drives the preferred-slot picker (hidden when empty). */
    const gym = useAsync(() => data.getGymFresh(), [data]);
    const slots = useMemo(() => (gym.data?.timeSlots ?? []).filter((slot) => slot.start && slot.end), [gym.data]);
    /** Tag catalogue for the multi-select (local list so quick-create can append). */
    const tagsQ = useAsync(() => data.listTags(), [data, open]);
    const [tagList, setTagList] = useState([]);
    useEffect(() => {
        if (open && Array.isArray(tagsQ.data))
            setTagList(tagsQ.data);
    }, [open, tagsQ.data]);
    const [newTagOpen, setNewTagOpen] = useState(false);
    const [newTagName, setNewTagName] = useState("");
    const [newTagColor, setNewTagColor] = useState("#6366f1");
    const [tagSaving, setTagSaving] = useState(false);
    /** Creates a tag inline, adds it to the picker and selects it. */
    async function handleCreateTag() {
        const name = newTagName.trim();
        if (!name || tagSaving)
            return;
        setTagSaving(true);
        try {
            const created = await data.createTag({ name, color: newTagColor });
            setTagList((prev) => [...prev, created]);
            setValue("tagIds", [...(watch("tagIds") ?? []), created.id], { shouldDirty: true });
            setNewTagName("");
            setNewTagOpen(false);
            toast.success(`Tag "${created.name}" created.`);
        }
        catch (error) {
            toast.error(error instanceof Error ? error.message : "Unable to create the tag.");
        }
        finally {
            setTagSaving(false);
        }
    }
    useEffect(() => {
        if (!open)
            return;
        setRecordPayment(false);
        setPaymentMethod("cash");
        setNewTagOpen(false);
        setNewTagName("");
        if (!member) {
            reset(emptyValues());
            return;
        }
        reset({
            ...emptyValues(),
            fullName: member.fullName,
            email: member.email ?? "",
            phone: member.phone,
            dateOfBirth: member.dateOfBirth ? toDateOnly(member.dateOfBirth) : "",
            gender: member.gender ?? undefined,
            address: member.address ?? "",
            emergencyContactName: member.emergencyContactName ?? "",
            emergencyContactPhone: member.emergencyContactPhone ?? "",
            joinDate: toDateOnly(member.joinDate),
            photoUrl: member.photoUrl ?? "",
            notes: member.notes ?? "",
            plannedHoursPerDay: member.plannedHoursPerDay ?? Number.NaN,
            preferredSlot: member.preferredSlot ?? "",
            tagIds: member.tagIds ?? [],
            age: typeof member.age === "number" && member.age > 0 ? member.age : Number.NaN,
            // Hidden in edit mode; the schema only requires it on create.
            mode: "edit",
            // Hidden in edit mode, but the schema still requires non-empty values.
            // They are never sent to `updateMember`, so a placeholder is safe.
            planId: member.membership?.planId ?? member.id,
            membershipStart: member.membership?.startDate ?? toDateOnly(member.joinDate),
            loginPassword: "",
        });
    }, [open, member, reset]);
    const submit = handleSubmit((values) => {
        void run(async () => {
            try {
                const saved = await onSave(member
                    ? { mode: "update", input: toUpdateInput(values) }
                    : { mode: "create", input: toCreateInput(values, paymentMethod, recordPayment) });
                if (saved)
                    onOpenChange(false);
            }
            catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to save this student.");
            }
        });
    });
    return (<Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit student" : "Add student"}</DialogTitle>
          <DialogDescription>
            {isEdit
            ? "Update personal details, contact information and emergency contact."
            : "Create A student profile and assign their first membership."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} noValidate className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="member-name">Full name</Label>
              <Input id="member-name" placeholder="Aarav Sharma" {...register("fullName")}/>
              {errors.fullName ? <p className="text-xs text-destructive">{errors.fullName.message}</p> : null}
            </div>

            {/* Right at the top so the photo setter is obvious when the form opens. */}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="member-photo">Profile photo</Label>
              <PhotoPicker value={photoValue} name={memberName} onChange={(next) => setValue("photoUrl", next, { shouldDirty: true })}/>
              {errors.photoUrl ? (<p className="text-xs text-destructive">{errors.photoUrl.message}</p>) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-email">Email</Label>
              <Input id="member-email" type="email" placeholder="student@kalamandir.com" {...register("email")}/>
              {errors.email ? <p className="text-xs text-destructive">{errors.email.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-phone">Phone</Label>
              <Input id="member-phone" placeholder="+91 98765 43210" {...register("phone")}/>
              {errors.phone ? <p className="text-xs text-destructive">{errors.phone.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-dob">Date of birth</Label>
              <Input id="member-dob" type="date" {...register("dateOfBirth")}/>
              {errors.dateOfBirth ? (<p className="text-xs text-destructive">{errors.dateOfBirth.message}</p>) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-age">Age (years)</Label>
              <Input id="member-age" type="number" min={1} max={120} placeholder="e.g. 12" {...register("age", { valueAsNumber: true })}/>
              {errors.age ? (<p className="text-xs text-destructive">{errors.age.message}</p>) : null}
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Controller control={control} name="gender" render={({ field }) => (<Select value={field.value ?? "prefer_not_to_say"} onValueChange={(value) => field.onChange(value)}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Choose"/>
                    </SelectTrigger>
                    <SelectContent>
                      {GENDER_OPTIONS.map((option) => (<SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>))}
                    </SelectContent>
                  </Select>)}/>
              {errors.gender ? <p className="text-xs text-destructive">{errors.gender.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-join">Join date</Label>
              <Input id="member-join" type="date" {...register("joinDate")}/>
              {errors.joinDate ? (<p className="text-xs text-destructive">{errors.joinDate.message}</p>) : null}
            </div>

            {/* Preferred slot — the batch the student chose at joining (gym slots from Manage Institute). */}
            {slots.length > 0 ? (<div className="space-y-2 sm:col-span-2">
              <Label>Preferred time slot</Label>
              <Controller control={control} name="preferredSlot" render={({ field }) => (<div className="flex flex-wrap gap-2">
                  {slots.map((slot) => {
                    const key = `${slot.start}-${slot.end}`;
                    const active = field.value === key;
                    return (<button key={key} type="button" onClick={() => field.onChange(active ? "" : key)} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${active
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border/60 bg-background text-muted-foreground hover:bg-accent"}`}>
                        {timeSlotLabel(slot)}
                      </button>);
                  })}
                </div>)}/>
              <p className="text-[11px] text-muted-foreground">
                The batch this student usually attends (slots come from Manage Institute). Click the chosen slot again for “no preference”.
              </p>
              {errors.preferredSlot ? (<p className="text-xs text-destructive">{errors.preferredSlot.message}</p>) : null}
            </div>) : null}

            {/* Tags — student labels (dance style, batch, event, level…). */}
            <div className="space-y-2 sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label>Tags</Label>
                <Button type="button" size="sm" variant="ghost" className="h-7 gap-1 px-2 text-xs" onClick={() => setNewTagOpen((v) => !v)}>
                  <PlusIcon className="size-3.5"/> New tag
                </Button>
              </div>
              <Controller control={control} name="tagIds" render={({ field }) => (<div className="flex flex-wrap items-center gap-2">
                  {(tagList ?? []).map((tag) => {
                    const selected = (field.value ?? []).includes(tag.id);
                    return (<button key={tag.id} type="button"
                      onClick={() => field.onChange(selected
                        ? (field.value ?? []).filter((id) => id !== tag.id)
                        : [...(field.value ?? []), tag.id])}
                      className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-colors"
                      style={selected
                        ? { borderColor: tag.color, backgroundColor: `${tag.color}24`, color: tag.color }
                        : undefined}>
                      <span className="size-2 shrink-0 rounded-full" style={{ backgroundColor: tag.color }}/>
                      {tag.name}
                    </button>);
                  })}
                  {tagList.length === 0 ? (<p className="text-[11px] text-muted-foreground">No tags yet — create the first one.</p>) : null}
                </div>)}/>
              {newTagOpen ? (<div className="flex items-center gap-2 rounded-lg border border-border/60 bg-secondary/40 p-2">
                  <input type="color" value={newTagColor} onChange={(event) => setNewTagColor(event.target.value)} className="h-8 w-8 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0" aria-label="Tag colour"/>
                  <Input value={newTagName} onChange={(event) => setNewTagName(event.target.value)}
                    onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); void handleCreateTag(); } }}
                    placeholder="e.g. Hip-Hop Crew" className="h-8 flex-1" aria-label="New tag name" autoFocus/>
                  <Button type="button" size="sm" className="h-8" disabled={tagSaving || !newTagName.trim()} onClick={() => void handleCreateTag()}>
                    {tagSaving ? <Loader2Icon className="size-4 animate-spin"/> : "Add"}
                  </Button>
                </div>) : null}
              <p className="text-[11px] text-muted-foreground">
                Labels to group students — dance style, batch, event or level. Click to toggle; manage all tags from the Members page.
              </p>
              {errors.tagIds ? (<p className="text-xs text-destructive">{errors.tagIds.message}</p>) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-emergency-name">Emergency contact name</Label>
              <Input id="member-emergency-name" placeholder="Meera Sharma" {...register("emergencyContactName")}/>
              {errors.emergencyContactName ? (<p className="text-xs text-destructive">{errors.emergencyContactName.message}</p>) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="member-emergency-phone">Emergency contact phone</Label>
              <Input id="member-emergency-phone" placeholder="+91 98765 43210" {...register("emergencyContactPhone")}/>
              {errors.emergencyContactPhone ? (<p className="text-xs text-destructive">{errors.emergencyContactPhone.message}</p>) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="member-address">Address</Label>
              <Input id="member-address" placeholder="Flat 4B, Palm Grove, Indiranagar" {...register("address")}/>
              {errors.address ? <p className="text-xs text-destructive">{errors.address.message}</p> : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="member-notes">Notes</Label>
              <Textarea id="member-notes" rows={2} placeholder="Injuries, goals, preferred slot…" {...register("notes")}/>
              {errors.notes ? <p className="text-xs text-destructive">{errors.notes.message}</p> : null}
            </div>
          </div>

          {!isEdit ? (<>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <p className="text-sm font-medium sm:col-span-2">First membership</p>

                <div className="space-y-2 sm:col-span-2">
                  <Label>Plan</Label>
                  <Controller control={control} name="planId" render={({ field }) => (<Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choose a plan"/>
                        </SelectTrigger>
                        <SelectContent>
                          {planChoices.map((plan) => (<SelectItem key={plan.id} value={plan.id}>
                              {plan.name} · {durationLabel(plan.durationValue, plan.durationUnit)}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>)}/>
                  {selectedPlan ? (<div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-lg border border-border/60 bg-secondary/40 px-3 py-2 text-xs">
                      <span className="flex items-baseline gap-1.5">
                        <span className="text-muted-foreground">Total</span>
                        <span className="text-sm font-semibold text-foreground">{formatINR(selectedPlan.price)}</span>
                      </span>
                      <span className="text-muted-foreground">
                        {durationLabel(selectedPlan.durationValue, selectedPlan.durationUnit)}
                      </span>
                      {selectedPlan.classQuota ? (<span className="text-muted-foreground">
                          {selectedPlan.classQuota} classes
                        </span>) : null}
                    </div>) : null}
                  {errors.planId ? <p className="text-xs text-destructive">{errors.planId.message}</p> : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-start">Membership starts</Label>
                  <Input id="member-start" type="date" {...register("membershipStart")}/>
                  {errors.membershipStart ? (<p className="text-xs text-destructive">{errors.membershipStart.message}</p>) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="member-payment-amount">Initial payment (₹)</Label>
                  <Input id="member-payment-amount" inputMode="decimal" placeholder="0" disabled={!recordPayment} {...register("initialPayment", {
            setValueAs: (value) => {
                if (value === "" || value === null || value === undefined)
                    return undefined;
                const parsed = Number(String(value).replace(/[^0-9.-]/g, ""));
                return Number.isFinite(parsed) ? parsed : Number.NaN;
            },
        })}/>
                  {errors.initialPayment ? (<p className="text-xs text-destructive">{errors.initialPayment.message}</p>) : null}
                </div>

                <div className="flex flex-wrap items-center gap-4 sm:col-span-2">
                  <label htmlFor="member-record-payment" className="flex cursor-pointer items-center gap-2 text-sm">
                    <Checkbox id="member-record-payment" checked={recordPayment} onCheckedChange={(checked) => setRecordPayment(checked === true)}/>
                    Record a payment with this membership
                  </label>

                  {recordPayment ? (<div className="flex items-center gap-2">
                      <Label htmlFor="member-payment-method" className="text-xs text-muted-foreground">
                        Method
                      </Label>
                      <Select value={paymentMethod} onValueChange={(value) => setPaymentMethod(value)}>
                        <SelectTrigger id="member-payment-method" size="sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PAYMENT_METHODS.map((method) => (<SelectItem key={method} value={method}>
                              {PAYMENT_METHOD_LABELS[method]}
                            </SelectItem>))}
                        </SelectContent>
                      </Select>
                    </div>) : null}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <p className="text-sm font-medium sm:col-span-2">Student portal login</p>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="member-login-password">Portal password</Label>
                  <Input id="member-login-password" placeholder="Default: test@123" autoComplete="new-password" {...register("loginPassword")}/>
                  <p className="text-xs text-muted-foreground">
                    the student signs in with their email + this password.
                    Leave empty to use the default <code>test@123</code>.
                  </p>
                  {errors.loginPassword ? (<p className="text-xs text-destructive">{errors.loginPassword.message}</p>) : null}
                </div>
              </div>
            </>) : null}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? <Loader2Icon className="size-4 animate-spin"/> : null}
              {submitting ? "Saving…" : isEdit ? "Save changes" : "Add student"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>);
}
