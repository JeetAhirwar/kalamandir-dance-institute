import { hasApiConfig, isDemoMode } from "@/config/env";
import { DemoDataService } from "@/data/demo/service";
import { ApiAuthProvider } from "@/data/api/auth";
import { ApiDataService } from "@/data/api/service";
/**
 * Service locator.
 *
 * Mode selection:
 *  - VITE_API_URL set       -> live REST backend (JWT auth) — always preferred.
 *  - VITE_DEMO_MODE=true    -> local seeded dataset with a permanent DEMO badge.
 *  - neither                -> app boots into a "setup required" screen.
 */
let authService = null;
let dataService = null;
let dataServiceKey = null;
export function getAuthProvider() {
    if (authService)
        return authService;
    authService = isDemoMode ? new DemoAuthProvider() : new ApiAuthProvider();
    return authService;
}
export function getDataService(session) {
    const key = `${session.demo ? "demo" : "api"}:${session.gym.id}`;
    if (dataService && dataServiceKey === key)
        return dataService;
    dataService = session.demo ? DemoDataService.load() : new ApiDataService(session.gym.id);
    dataServiceKey = key;
    return dataService;
}
export function resetDataService() {
    dataService = null;
    dataServiceKey = null;
}
export function appMode() {
    if (hasApiConfig)
        return "api";
    return isDemoMode ? "demo" : "unconfigured";
}
/* ------------------------------------------------------------------ */
/*  Demo auth                                                          */
/* ------------------------------------------------------------------ */
const DEMO_SESSION_KEY = "pgs.demo.session";
export const DEMO_CREDENTIALS = { email: "admin@kalamandir.demo", password: "demo1234" };
class DemoAuthProvider {
    mode = "demo";
    async getSession() {
        if (typeof window === "undefined")
            return null;
        const stored = window.sessionStorage.getItem(DEMO_SESSION_KEY);
        if (!stored)
            return null;
        const db = DemoDataService.load();
        if (stored.startsWith("member:")) {
            const memberId = stored.slice("member:".length);
            const member = db.db.members.find((m) => m.id === memberId);
            if (!member)
                return null;
            const profile = {
                id: `demo-user-${member.id}`,
                gymId: db.gym.id,
                fullName: member.fullName,
                email: null,
                phone: member.phone ?? null,
                role: "member",
                avatarUrl: member.photoUrl ?? null,
                isActive: member.status === "active",
                memberId: member.id,
            };
            return {
                userId: profile.id,
                email: null,
                profile,
                gym: db.gym,
                demo: true,
            };
        }
        return {
            userId: db.profile.id,
            email: db.profile.email,
            profile: db.profile,
            gym: db.gym,
            demo: true,
        };
    }
    async signIn(identifier, password) {
        const value = String(identifier ?? "").trim();
        // Demo staff sign in with the seeded admin email…
        const isStaff = value.toLowerCase() === DEMO_CREDENTIALS.email;
        // …or a demo student signs in with their printed Student ID (DEMO-9001).
        const db = DemoDataService.load();
        const member = !isStaff
            ? db.db.members.find((m) => m.memberCode.toUpperCase() === value.toUpperCase())
            : null;
        if (!isStaff && !member) {
            throw new Error("Use the demo credentials shown on the login screen.");
        }
        if (password !== DEMO_CREDENTIALS.password) {
            throw new Error("Use the demo credentials shown on the login screen.");
        }
        if (typeof window !== "undefined")
            window.sessionStorage.setItem(DEMO_SESSION_KEY, isStaff ? "staff" : `member:${member.id}`);
        if (isStaff) {
            return {
                userId: db.profile.id,
                email: db.profile.email,
                profile: db.profile,
                gym: db.gym,
                demo: true,
            };
        }
        // Student portal session — mirrors the API's role: "member" payload.
        const profile = {
            id: `demo-user-${member.id}`,
            gymId: db.gym.id,
            fullName: member.fullName,
            email: null,
            phone: member.phone ?? null,
            role: "member",
            avatarUrl: member.photoUrl ?? null,
            isActive: member.status === "active",
            memberId: member.id,
        };
        return {
            userId: profile.id,
            email: null,
            profile,
            gym: db.gym,
            demo: true,
        };
    }
    async signOut() {
        if (typeof window !== "undefined")
            window.sessionStorage.removeItem(DEMO_SESSION_KEY);
    }
    onAuthChange(cb) {
        const handler = (event) => {
            void this.getSession().then(cb);
            event.preventDefault();
        };
        window.addEventListener("pgs-demo-auth", handler);
        return () => window.removeEventListener("pgs-demo-auth", handler);
    }
}
