import { useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "motion/react";
import { BarChart3Icon, Building2Icon, CalendarCheckIcon, CalendarDaysIcon, ChevronLeftIcon, CreditCardIcon, LayoutDashboardIcon, Music2Icon, PanelLeftCloseIcon, PanelLeftOpenIcon, SettingsIcon, TagsIcon, UsersIcon, UserSquare2Icon, XIcon, } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/auth/AuthProvider";
import { can } from "@/lib/permissions";
export const NAV_ITEMS = [
    { to: "/", label: "Dashboard", icon: LayoutDashboardIcon, end: true },
    { to: "/members", label: "Students", icon: UsersIcon, capability: "members.view" },
    { to: "/attendance", label: "Attendance", icon: CalendarCheckIcon, capability: "attendance.view", activeWhen: ["/attendance", "/attendance/history"] },
    { to: "/plans", label: "Membership Plans", icon: TagsIcon, capability: "plans.view" },
    { to: "/payments", label: "Payments & Fees", icon: CreditCardIcon, capability: "payments.view" },
    { to: "/staff", label: "Trainers & Staff", icon: UserSquare2Icon, capability: "staff.view" },
    { to: "/classes", label: "Classes & Schedule", icon: CalendarDaysIcon, capability: "classes.view" },
    { to: "/reports", label: "Reports & Analytics", icon: BarChart3Icon, capability: "reports.view" },
    { to: "/notifications", label: "Notifications", icon: Music2Icon, capability: "notifications.view" },
    { to: "/manage-gym", label: "Manage Institute", icon: Building2Icon, capability: "settings.manage", end: true },
    { to: "/settings", label: "Settings", icon: SettingsIcon, capability: "settings.view" },
];
/** Gold arch-and-flame studio mark. */
function KMEmblem({ className }) {
    return (<svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className={className}>
      <path d="M24 4C14 4 8 11 8 21v23h32V21C40 11 34 4 24 4z" stroke="currentColor" strokeWidth="2.4"/>
      <path d="M24 15c-3.6 2.7-5.5 6-5.5 9.8 0 3.3 1.9 5.7 4.2 6.6-1.2 1.3-2 2.7-2 4.4h6.6c0-1.7-.8-3.1-2-4.4 2.3-.9 4.2-3.3 4.2-6.6 0-3.8-1.9-7.1-5.5-9.8z" fill="currentColor"/>
      <circle cx="24" cy="25" r="1.8" fill="#310d20"/>
    </svg>);
}
export function SidebarContent({ onNavigate, collapsed = false, onToggleCollapse, }) {
    const { session } = useAuth();
    const role = session?.profile.role;
    const location = useLocation();
    const items = useMemo(() => NAV_ITEMS.filter((item) => !item.capability || can(role, item.capability)), [role]);
    return (<div className="relative flex h-full flex-col">
      {/* Faint palace-arch texture — brand warmth, kept very subtle */}
      <div aria-hidden="true" className="arch-motif pointer-events-none absolute inset-x-0 bottom-0 h-72 opacity-[0.5] [mask-image:linear-gradient(to_top,black,transparent)]"/>

      {/* Brand header */}
      <div className={cn("relative flex items-center gap-3 border-b border-sidebar-border/60 transition-[padding] duration-300", collapsed ? "flex-col gap-2 px-3 py-5" : "px-5 py-5")}>
        <span className={cn("gold-halo flex shrink-0 items-center justify-center rounded-xl border border-km-gold/35 bg-km-gold/10 text-km-gold transition-all duration-300", collapsed ? "size-10" : "size-9")}>
          <KMEmblem className={cn("transition-all duration-300", collapsed ? "size-5" : "size-5")}/>
        </span>
        {!collapsed ? (<div className="min-w-0 flex-1">
            <p className="truncate font-display text-[15px] font-semibold tracking-[0.12em] text-km-ivory">
              KALA MANDIR
            </p>
            <p className="truncate text-[10px] font-medium tracking-[0.2em] text-km-gold/80 uppercase">
              {session?.gym.name ?? "Dance N Art Studio"}
            </p>
          </div>) : null}
        {/* Collapse toggle (desktop only) */}
        {onToggleCollapse ? (<button type="button" onClick={onToggleCollapse} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"} className={cn("hidden shrink-0 rounded-md p-1.5 text-km-ivory/55 transition-colors hover:bg-sidebar-accent hover:text-km-gold lg:block", collapsed && "absolute top-4 -right-3 border border-sidebar-border bg-sidebar")}>
            {collapsed ? <PanelLeftOpenIcon className="size-4"/> : <PanelLeftCloseIcon className="size-4"/>}
          </button>) : null}
      </div>

      <nav className="relative flex-1 space-y-1 overflow-y-auto overflow-x-hidden px-3 py-4" aria-label="Primary">
        {items.map((item) => {
            const active = item.activeWhen
                ? item.activeWhen.includes(location.pathname)
                : item.end
                    ? location.pathname === item.to
                    : location.pathname.startsWith(item.to);
            return (<NavLink key={item.to} to={item.to} end={item.end} onClick={onNavigate} title={collapsed ? item.label : undefined} className={cn("group relative flex items-center rounded-xl text-sm transition-colors outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", collapsed ? "size-11 justify-center" : "gap-3 px-3 py-2.5", active
                    ? "bg-km-gold/12 text-km-ivory"
                    : "text-km-ivory/60 hover:bg-sidebar-accent hover:text-km-ivory")} aria-current={active ? "page" : "false"}>
              {/* Gold active indicator — reliable fade-in (no fragile cross-item layoutId handoff) */}
              {active ? (<motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.18, ease: "easeOut" }} className={cn("absolute rounded-full bg-km-gold", collapsed
                    ? "inset-x-3 bottom-1 h-[3px]"
                    : "left-0 top-1/2 h-6 w-[3px] -translate-y-1/2")} aria-hidden/>) : null}
              <item.icon className={cn("size-[18px] shrink-0 transition-colors", active ? "text-km-gold" : "text-km-ivory/55 group-hover:text-km-gold")}/>
              {!collapsed ? (<span className={cn("truncate font-medium", active && "text-km-ivory")}>{item.label}</span>) : null}
            </NavLink>);
        })}
      </nav>

      <div className={cn("relative border-t border-sidebar-border/60 py-4 text-xs text-km-ivory/45 transition-[padding] duration-300", collapsed ? "px-3 text-center" : "px-5")}>
        {!collapsed ? (<>
            <p className="font-medium text-km-ivory/70">Kala Mandir · v1.0</p>
            <p className="mt-0.5">Attendance · memberships · class quotas</p>
          </>) : (<ChevronLeftIcon className="mx-auto size-3.5 opacity-50"/>)}
      </div>
    </div>);
}
export function MobileSidebar({ open, onClose }) {
    return (<div className={cn("fixed inset-0 z-50 lg:hidden", open ? "" : "pointer-events-none")} aria-hidden={!open}>
      <div onClick={onClose} className={cn("absolute inset-0 bg-black/60 transition-opacity", open ? "opacity-100" : "opacity-0")}/>
      <aside className={cn("absolute inset-y-0 left-0 w-72 border-r border-sidebar-border bg-sidebar transition-transform duration-300", open ? "translate-x-0" : "-translate-x-full")}>
        <button type="button" onClick={onClose} aria-label="Close navigation" className="absolute top-4 right-4 z-10 rounded-md p-1.5 text-km-ivory/70 transition-colors hover:bg-sidebar-accent hover:text-km-gold">
          <XIcon className="size-4"/>
        </button>
        <SidebarContent onNavigate={onClose}/>
      </aside>
    </div>);
}
