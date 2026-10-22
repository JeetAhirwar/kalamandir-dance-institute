import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
    ArrowUpRight,
    CheckCircle2,
    Copy,
    Loader2,
    MessageCircle,
    TriangleAlert,
} from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import { Reveal, RevealGroup, RevealItem } from "@/components/Reveal";
import { buildWhatsAppUrl, contactLinks, siteConfig } from "@/data/siteConfig";
import { cn } from "@/lib/utils";

/* -------------------------------------------------------------------------- */
/* Schema                                                                      */
/* -------------------------------------------------------------------------- */

const INTERESTS = [
    "Art",
    "Painting",
    "Craft",
    "Dance",
    "Zumba",
    "Wedding / Event Choreography",
];

const AGE_GROUPS = [
    "Under 8",
    "8 – 12",
    "13 – 17",
    "18 – 30",
    "31 – 50",
    "Above 50",
];

const METHODS = ["WhatsApp", "Phone call", "SMS"];

const schema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Please enter your name.")
        .max(80, "That name is a little long — please shorten it."),
    phone: z
        .string()
        .trim()
        .regex(
            /^(\+?91[-\s]?)?[6-9]\d{9}$/,
            "Enter a valid 10-digit Indian mobile number.",
        ),
    interest: z.string().min(1, "Please choose what you're interested in."),
    ageGroup: z.string().optional(),
    method: z.enum(["WhatsApp", "Phone call", "SMS"], {
        message: "Please choose how we should contact you.",
    }),
    message: z
        .string()
        .trim()
        .max(600, "Please keep the message under 600 characters.")
        .optional(),
    // Honeypot — hidden from humans, tempting for bots. Any value here is
    // dropped silently in `onSubmit`; nothing to reveal, no validation error.
    company: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/* Component                                                                   */
/* -------------------------------------------------------------------------- */

/**
 * EnquiryForm (H) — "Your Creative Journey Starts Here."
 *
 * States: idle → submitting → handed-off | blocked | error.
 *
 * With no backend configured (`siteConfig.enquiry.endpoint === null`) the form
 * does NOT pretend to send anything. It validates, composes the message, opens
 * a pre-filled WhatsApp thread and tells the visitor plainly that nothing was
 * transmitted until they press send in WhatsApp. See README.md.
 */
export default function EnquiryForm() {
    const reduce = useReducedMotion();
    const mountedAt = useRef(Date.now());
    const messageRef = useRef("");

    const [status, setStatus] = useState("idle"); // idle | submitting | handed-off | blocked | error
    const [copied, setCopied] = useState(false);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(schema),
        mode: "onTouched",
        defaultValues: {
            name: "",
            phone: "",
            interest: "",
            ageGroup: "",
            method: "WhatsApp",
            message: "",
            company: "",
        },
    });

    // A class card can pre-select the interest before the visitor arrives.
    useEffect(() => {
        const onInterest = (event) => {
            const interest = event.detail?.interest;
            if (interest && INTERESTS.includes(interest)) {
                setValue("interest", interest, { shouldValidate: true });
            }
        };
        window.addEventListener("km:interest", onInterest);
        return () => window.removeEventListener("km:interest", onInterest);
    }, [setValue]);

    const composed = useMemo(() => {
        const v = getValues();
        const lines = [
            `Hello Kala Mandir, I'd like to enquire about ${v.interest || "a class"}.`,
            "",
            `Name: ${v.name || ""}`,
            `Phone: ${v.phone || ""}`,
        ];
        if (v.ageGroup) lines.push(`Age group: ${v.ageGroup}`);
        lines.push(`Preferred contact: ${v.method || ""}`);
        if (v.message) lines.push(`Message: ${v.message}`);
        lines.push("", `— sent from ${siteConfig.domain}`);
        return lines.join("\n");
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [status]);

    const onSubmit = async (values) => {
        // Spam guard: require a human amount of time on the form.
        if (Date.now() - mountedAt.current < siteConfig.enquiry.minFillMs) {
            setStatus("error");
            return;
        }
        // Honeypot tripped → silently drop, never show an error to the bot.
        if (values.company) {
            setStatus("handed-off");
            return;
        }

        messageRef.current = composed;

        try {
            if (siteConfig.enquiry.endpoint) {
                setStatus("submitting");
                const response = await fetch(siteConfig.enquiry.endpoint, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(values),
                });
                if (!response.ok) throw new Error("Request failed");
                setStatus("handed-off");
                return;
            }

            // No backend: hand the composed enquiry to WhatsApp.
            setStatus("submitting");
            const url = buildWhatsAppUrl(messageRef.current);
            const win = window.open(url, "_blank", "noopener,noreferrer");
            if (win) {
                setStatus("handed-off");
                // Leave the visitor where they are; the new tab carries the thread.
            } else {
                setStatus("blocked");
            }
        } catch {
            setStatus("error");
        }
    };

    const copyMessage = async () => {
        try {
            await navigator.clipboard.writeText(messageRef.current || composed);
            setCopied(true);
            setTimeout(() => setCopied(false), 2200);
        } catch {
            setCopied(false);
        }
    };

    const busy = isSubmitting || status === "submitting";

    return (
        <section
            id="enquiry"
            data-tone="light"
            aria-labelledby="enquiry-title"
            className="relative bg-white py-24 sm:py-28 lg:py-36"
        >
            <div className="shell">
                <div className="grid grid-cols-1 gap-y-12 lg:grid-cols-12 lg:gap-x-14">
                    {/* ── Left: heading + WhatsApp alternative ── */}
                    <div className="lg:col-span-5">
                        <SectionHeading
                            id="enquiry-title"
                            number="07"
                            eyebrow="Trial class & enquiry"
                            title={
                                <>
                                    Your creative journey{" "}
                                    <span className="italic text-coral">
                                        starts here
                                    </span>
                                    .
                                </>
                            }
                            standfirst="Tell us what you'd like to learn. We'll confirm availability, timing and everything else on WhatsApp."
                        />

                        <Reveal delay={0.1} className="mt-9">
                            {/* Obvious WhatsApp alternative */}
                            <a
                                href={contactLinks.whatsapp}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group flex items-start gap-4 rounded-[14px] border border-rule bg-paper p-5 transition-colors duration-200 hover:border-[#25D366]/60 sm:items-center"
                            >
                                <span
                                    aria-hidden="true"
                                    className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-[#25D366] text-white"
                                >
                                    <MessageCircle className="h-5 w-5" />
                                </span>
                                <span className="min-w-0 flex-1">
                                    <span className="block text-[15.5px] font-medium text-text">
                                        Prefer WhatsApp? Message us directly
                                    </span>
                                    <span className="mt-0.5 block text-[14px] text-muted">
                                        {siteConfig.phone.display}
                                    </span>
                                </span>
                                <ArrowUpRight
                                    aria-hidden="true"
                                    className="mt-3 h-4 w-4 shrink-0 text-muted transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 sm:mt-0"
                                />
                            </a>

                            <div className="mt-5 grid grid-cols-2 gap-3">
                                <a
                                    href={contactLinks.phone}
                                    className="rounded-[12px] border border-rule py-3.5 text-center text-[14px] text-text transition-colors duration-200 hover:border-text"
                                >
                                    Call the studio
                                </a>
                                <a
                                    href={contactLinks.instagram}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-[12px] border border-rule py-3.5 text-center text-[14px] text-text transition-colors duration-200 hover:border-text"
                                >
                                    Instagram
                                </a>
                            </div>

                            {/* Honest privacy note */}
                            <p className="mt-6 border-t border-rule pt-4 text-[13.5px] leading-relaxed text-muted">
                                Your details are used only to reply to this
                                enquiry. Nothing is stored on this website, and
                                nothing is shared with third parties.
                            </p>
                        </Reveal>
                    </div>

                    {/* ── Right: the form ── */}
                    <div className="lg:col-span-6 lg:col-start-7">
                        <Reveal delay={0.08}>
                            <form
                                onSubmit={handleSubmit(onSubmit)}
                                noValidate
                                aria-describedby="form-note"
                                className="rounded-[16px] border border-rule bg-paper/60 p-5 sm:p-7 lg:p-9"
                            >
                                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                                    {/* Name */}
                                    <Field
                                        id="name"
                                        label="Your name"
                                        required
                                        error={errors.name?.message}
                                    >
                                        <input
                                            id="name"
                                            type="text"
                                            autoComplete="name"
                                            placeholder="e.g. Ananya Sharma"
                                            className="field"
                                            aria-invalid={errors.name ? "true" : "false"}
                                            aria-describedby={errors.name ? "name-error" : undefined}
                                            {...register("name")}
                                        />
                                    </Field>

                                    {/* Phone */}
                                    <Field
                                        id="phone"
                                        label="Phone number"
                                        required
                                        error={errors.phone?.message}
                                    >
                                        <input
                                            id="phone"
                                            type="tel"
                                            inputMode="tel"
                                            autoComplete="tel"
                                            placeholder="98765 43210"
                                            className="field"
                                            aria-invalid={errors.phone ? "true" : "false"}
                                            aria-describedby={errors.phone ? "phone-error" : "phone-hint"}
                                            {...register("phone")}
                                        />
                                        {!errors.phone && (
                                            <p id="phone-hint" className="mt-1.5 text-[12.5px] text-[#8d867c]">
                                                10-digit mobile number
                                            </p>
                                        )}
                                    </Field>

                                    {/* Interested in */}
                                    <Field
                                        id="interest"
                                        label="Interested in"
                                        required
                                        error={errors.interest?.message}
                                    >
                                        <select
                                            id="interest"
                                            className="field"
                                            aria-invalid={errors.interest ? "true" : "false"}
                                            aria-describedby={errors.interest ? "interest-error" : undefined}
                                            {...register("interest")}
                                        >
                                            <option value="">Select a class</option>
                                            {INTERESTS.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>

                                    {/* Age group (optional) */}
                                    <Field id="ageGroup" label="Age group" optional>
                                        <select
                                            id="ageGroup"
                                            className="field"
                                            {...register("ageGroup")}
                                        >
                                            <option value="">Prefer not to say</option>
                                            {AGE_GROUPS.map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </Field>

                                    {/* Preferred contact method */}
                                    <fieldset className="sm:col-span-2">
                                        <legend className="eyebrow mb-3 text-muted">
                                            Preferred contact method
                                        </legend>
                                        <div className="flex flex-wrap gap-2.5">
                                            {METHODS.map((method) => (
                                                <label
                                                    key={method}
                                                    className={cn(
                                                        "cursor-pointer rounded-full border px-4 py-2.5 text-[14px] transition-all duration-200",
                                                        "has-[:checked]:border-text has-[:checked]:bg-text has-[:checked]:text-paper",
                                                        "border-rule text-muted hover:border-[#c9c2b5] hover:text-text",
                                                    )}
                                                >
                                                    <input
                                                        type="radio"
                                                        value={method}
                                                        className="sr-only"
                                                        {...register("method")}
                                                    />
                                                    {method}
                                                </label>
                                            ))}
                                        </div>
                                        {errors.method && (
                                            <FieldError id="method-error">
                                                {errors.method.message}
                                            </FieldError>
                                        )}
                                    </fieldset>

                                    {/* Message (optional) */}
                                    <Field
                                        id="message"
                                        label="Message"
                                        optional
                                        className="sm:col-span-2"
                                        error={errors.message?.message}
                                    >
                                        <textarea
                                            id="message"
                                            rows={3}
                                            placeholder="Anything we should know — experience level, preferred days, a performance coming up…"
                                            className="field"
                                            aria-invalid={errors.message ? "true" : "false"}
                                            aria-describedby={errors.message ? "message-error" : undefined}
                                            {...register("message")}
                                        />
                                    </Field>

                                    {/* Honeypot */}
                                    <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                                        <label htmlFor="company">Company</label>
                                        <input
                                            id="company"
                                            type="text"
                                            tabIndex={-1}
                                            autoComplete="off"
                                            {...register("company")}
                                        />
                                    </div>
                                </div>

                                {/* Status region */}
                                <div aria-live="polite" className="mt-6">
                                    <AnimatePresence mode="wait" initial={false}>
                                        {status === "handed-off" && !siteConfig.enquiry.endpoint && (
                                            <StatusPanel
                                                key="handed-off"
                                                tone="success"
                                                title="Your enquiry is ready in WhatsApp"
                                                body="A new tab has opened with your details filled in — press send there and we'll reply. Nothing was submitted to this website, because this site has no server to submit to."
                                                reduce={reduce}
                                            >
                                                <div className="mt-4 flex flex-wrap gap-2.5">
                                                    <a
                                                        href={buildWhatsAppUrl(messageRef.current || composed)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="inline-flex items-center gap-2 rounded-[9px] bg-[#25D366] px-4 py-2.5 text-[14px] font-medium text-white transition-opacity hover:opacity-90"
                                                    >
                                                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                                        Open WhatsApp again
                                                    </a>
                                                    <button
                                                        type="button"
                                                        onClick={copyMessage}
                                                        className="inline-flex items-center gap-2 rounded-[9px] border border-rule px-4 py-2.5 text-[14px] text-text transition-colors hover:border-text"
                                                    >
                                                        <Copy className="h-4 w-4" aria-hidden="true" />
                                                        {copied ? "Copied" : "Copy details"}
                                                    </button>
                                                </div>
                                            </StatusPanel>
                                        )}

                                        {status === "blocked" && (
                                            <StatusPanel
                                                key="blocked"
                                                tone="warn"
                                                title="Your browser blocked the WhatsApp tab"
                                                body="Please allow pop-ups for this site, or use one of these options instead:"
                                                reduce={reduce}
                                            >
                                                <div className="mt-4 flex flex-wrap gap-2.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => window.open(buildWhatsAppUrl(messageRef.current || composed), "_blank", "noopener,noreferrer")}
                                                        className="inline-flex items-center gap-2 rounded-[9px] bg-[#25D366] px-4 py-2.5 text-[14px] font-medium text-white"
                                                    >
                                                        <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                                        Try WhatsApp again
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={copyMessage}
                                                        className="inline-flex items-center gap-2 rounded-[9px] border border-rule px-4 py-2.5 text-[14px] text-text"
                                                    >
                                                        <Copy className="h-4 w-4" aria-hidden="true" />
                                                        {copied ? "Copied" : "Copy details"}
                                                    </button>
                                                </div>
                                            </StatusPanel>
                                        )}

                                        {status === "error" && (
                                            <StatusPanel
                                                key="error"
                                                tone="warn"
                                                title="That didn't go through"
                                                body="Please try again, or reach us directly on WhatsApp — your details will still be here."
                                                reduce={reduce}
                                            />
                                        )}
                                    </AnimatePresence>
                                </div>

                                {/* Submit */}
                                <div id="form-note" className="mt-7 border-t border-rule pt-6">
                                    <button
                                        type="submit"
                                        disabled={busy}
                                        className={cn(
                                            "group inline-flex w-full items-center justify-center gap-2.5 rounded-[11px] px-7 py-4 text-[15.5px] font-medium tracking-[0.01em] transition-all duration-200 sm:w-auto",
                                            busy
                                                ? "cursor-wait bg-muted/50 text-white"
                                                : "bg-text text-paper hover:bg-blue",
                                        )}
                                    >
                                        {busy ? (
                                            <>
                                                <Loader2
                                                    className="h-4 w-4 animate-spin"
                                                    aria-hidden="true"
                                                />
                                                Preparing…
                                            </>
                                        ) : (
                                            <>
                                                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                                                Send enquiry on WhatsApp
                                                <ArrowUpRight
                                                    aria-hidden="true"
                                                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                                                />
                                            </>
                                        )}
                                    </button>

                                    <p className="mt-4 text-[13px] leading-relaxed text-muted">
                                        No backend is connected yet, so this opens a
                                        pre-filled WhatsApp message instead of a
                                        server submission. Your details stay on your
                                        device until you press send. See{" "}
                                        <span className="text-text">README.md</span>{" "}
                                        to connect a real endpoint.
                                    </p>
                                </div>
                            </form>
                        </Reveal>
                    </div>
                </div>
            </div>
        </section>
    );
}

/* -------------------------------------------------------------------------- */
/* Small internal pieces                                                       */
/* -------------------------------------------------------------------------- */

function Field({ id, label, required, optional, error, className, children }) {
    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="eyebrow mb-1.5 flex items-baseline gap-2 text-muted"
            >
                {label}
                {required && (
                    <span className="text-coral" aria-hidden="true">
                        *
                    </span>
                )}
                {optional && (
                    <span className="normal-case tracking-[0.05em] text-[#a9a49c]">
                        optional
                    </span>
                )}
            </label>
            {children}
            {error && <FieldError id={`${id}-error`}>{error}</FieldError>}
        </div>
    );
}

function FieldError({ id, children }) {
    return (
        <p
            id={id}
            role="alert"
            className="mt-1.5 flex items-start gap-1.5 text-[13px] text-[#b4462f]"
        >
            <TriangleAlert className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            {children}
        </p>
    );
}

function StatusPanel({ tone, title, body, children, reduce }) {
    const success = tone === "success";
    return (
        <motion.div
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            role="status"
            className={cn(
                "rounded-[12px] border p-4 sm:p-5",
                success
                    ? "border-[#25D366]/40 bg-[#25D366]/[0.07]"
                    : "border-coral/45 bg-coral/[0.07]",
            )}
        >
            <div className="flex items-start gap-3">
                {success ? (
                    <CheckCircle2
                        className="mt-0.5 h-5 w-5 shrink-0 text-[#1a9e4b]"
                        aria-hidden="true"
                    />
                ) : (
                    <TriangleAlert
                        className="mt-0.5 h-5 w-5 shrink-0 text-coral"
                        aria-hidden="true"
                    />
                )}
                <div className="min-w-0">
                    <p className="text-[15px] font-medium text-text">{title}</p>
                    <p className="mt-1 text-[14px] leading-relaxed text-muted">
                        {body}
                    </p>
                    {children}
                </div>
            </div>
        </motion.div>
    );
}
