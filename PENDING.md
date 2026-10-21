# Pending Work — Kala Mandir

## 1. Art / Dance categories (students segmentation) ⏳
**Requested by:** Sir (institute has 2 categories — Art and Dance; students are separate in each).
**Status:** Deferred — "baad me karenge".

### Options discussed
- **Option A — Tags (quick win):** existing Tags feature se "Art" & "Dance" tags banao aur students ko assign karo. Students-page filter already works. ~half day, zero schema change. Sirf label hai — dashboard/reports me alag count nahi.
- **Option B — Student `category` field (proper):** `category: "art" | "dance"` (required) on Member — schema + API + validation + students UI/filter + dashboard (per-category counts) + reports segmentation. ~1–2 days.
- **Option C — Separate institutes:** ❌ rejected (duplicate fees/staff/reports).

### Decide with Sir before building
1. Ek student dono kar sakta hai (Art + Dance)? → haan = tags/multi; sirf ek = single category field.
2. Dashboard/reports me alag-alag numbers chahiye? → haan = Option B zaroori.
3. Plans/fees alag honge Art ke aur Dance ke? → plans already alag ho sakte hain; category se link karenge.

### Recommended plan
Pehle Option A laga ke sir ko dikhao; agar dashboard/report segmentation chahiye toh Option B banao.

---

## 2. Vercel redeploy (backend + frontend) ⏳
`scheduleLabel` (plans) + dashboard redesign + sidebar changes + `?new=1` dialog fix — sab local me verified hai, live pe dikhane ke liye **dono services redeploy** karni hain.
