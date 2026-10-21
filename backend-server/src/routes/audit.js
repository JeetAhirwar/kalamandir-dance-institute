import { Router } from "express";
import AuditLog from "../models/AuditLog.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { asyncHandler } from "../lib/errors.js";
import { toAudit } from "../lib/serialize.js";
import { intParam } from "../middleware/validate.js";

const router = Router();

/** GET /api/audit?limit=50&page=1 → AuditLog[] (actorName populated). */
router.get(
  "/audit",
  requireAuth,
  asyncHandler(async (req, res) => {
    const limit = intParam(req.query.limit, 50, { min: 1, max: 200 });
    // Without ?page the route keeps returning a bare array (older clients);
    // with ?page it returns the { items, total, page, pageSize } shape.
    const pageParam = req.query.page;
    const page = intParam(pageParam, 1, { min: 1, max: 10_000 });
    const filter = { gymId: req.user.gymId };
    const [rows, total] = await Promise.all([
      AuditLog.find(filter)
        .sort({ createdAt: -1 })
        .skip(pageParam !== undefined ? (page - 1) * limit : 0)
        .limit(limit)
        .lean(),
      pageParam !== undefined ? AuditLog.countDocuments(filter) : Promise.resolve(rows.length),
    ]);

    const actorIds = [...new Set(rows.map((r) => r.actorId).filter(Boolean).map(String))];
    const actors = actorIds.length
      ? await User.find({ _id: { $in: actorIds } }).select("fullName").lean()
      : [];
    const actorById = new Map(actors.map((a) => [String(a._id), a]));

    const mapped = rows.map((row) => toAudit(row, actorById.get(String(row.actorId))));
    if (pageParam === undefined) {
      res.json(mapped);
      return;
    }
    res.json({ items: mapped, total, page, pageSize: limit });
  }),
);

export default router;
