import { Router } from "express";
import { z } from "zod";
import { Types } from "mongoose";
import Tag from "../models/Tag.js";
import Member from "../models/Member.js";
import { requireAuth, requireCap } from "../middleware/auth.js";
import { asyncHandler, badRequest, notFound, conflict } from "../lib/errors.js";
import { parseBody } from "../middleware/validate.js";
import { toTag } from "../lib/serialize.js";
import { writeAudit } from "../lib/audit.js";

const router = Router();

/* ------------------------------------------------------------------ */
/*  Validation                                                         */
/* ------------------------------------------------------------------ */

const tagIdParamSchema = z.object({
  id: z.string().trim().min(1, "Tag id is required."),
});

const createTagSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Tag name is required.")
    .max(40, "Tag name must be 40 characters or fewer."),
  color: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Color must be a hex value like #6366f1.")
    .nullish(),
});

const updateTagSchema = createTagSchema.partial();

/* ------------------------------------------------------------------ */
/*  Tag CRUD (student labels — dance styles, batches, events, …)       */
/* ------------------------------------------------------------------ */

/** GET /api/tags → Tag[] (gym's tags, name-sorted; any signed-in user may read). */
router.get(
  "/tags",
  requireAuth,
  asyncHandler(async (req, res) => {
    const rows = await Tag.find({ gymId: req.user.gymId }).sort({ name: 1 }).lean();
    res.json(rows.map(toTag));
  }),
);

/** POST /api/tags { name, color? } → Tag (capability: members.edit). */
router.post(
  "/tags",
  requireCap("members.edit"),
  asyncHandler(async (req, res) => {
    const { name, color } = parseBody(createTagSchema, req.body);

    const existing = await Tag.findOne({ gymId: req.user.gymId, name }).lean();
    if (existing) throw conflict(`A tag named "${name}" already exists.`);

    const tag = await Tag.create({
      gymId: req.user.gymId,
      name,
      color: color ?? "#6366f1",
    });

    await writeAudit({
      gymId: req.user.gymId,
      actorId: req.user.id,
      entity: "members",
      entityId: String(tag._id),
      action: "create_tag",
      newValues: { name: tag.name, color: tag.color },
    });

    res.status(201).json(toTag(tag));
  }),
);

/** PATCH /api/tags/:id { name?, color? } → Tag. */
router.patch(
  "/tags/:id",
  requireCap("members.edit"),
  asyncHandler(async (req, res) => {
    const input = parseBody(updateTagSchema, req.body);
    const parsedId = tagIdParamSchema.safeParse(req.params);
    if (!parsedId.success) throw badRequest("Tag id is required.");
    if (!Types.ObjectId.isValid(parsedId.data.id)) throw badRequest("Tag id is not valid.");

    const tag = await Tag.findOne({ _id: parsedId.data.id, gymId: req.user.gymId }).lean();
    if (!tag) throw notFound("Tag not found.");

    const { name, color } = input;
    if (name !== undefined && name !== tag.name) {
      const clash = await Tag.findOne({
        gymId: req.user.gymId,
        name,
        _id: { $ne: tag._id },
      }).lean();
      if (clash) throw conflict(`A tag named "${name}" already exists.`);
    }

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (color !== undefined) updates.color = color;

    const updated = await Tag.findOneAndUpdate(
      { _id: tag._id, gymId: req.user.gymId },
      { $set: updates },
      { new: true },
    ).lean();

    await writeAudit({
      gymId: req.user.gymId,
      actorId: req.user.id,
      entity: "members",
      entityId: String(tag._id),
      action: "update_tag",
      oldValues: { name: tag.name, color: tag.color },
      newValues: { name: updated.name, color: updated.color },
    });

    res.json(toTag(updated));
  }),
);

/** DELETE /api/tags/:id → 204 (the tag is pulled from every member first). */
router.delete(
  "/tags/:id",
  requireCap("members.edit"),
  asyncHandler(async (req, res) => {
    const parsedId = tagIdParamSchema.safeParse(req.params);
    if (!parsedId.success) throw badRequest("Tag id is required.");
    if (!Types.ObjectId.isValid(parsedId.data.id)) throw badRequest("Tag id is not valid.");

    const tag = await Tag.findOne({ _id: parsedId.data.id, gymId: req.user.gymId }).lean();
    if (!tag) throw notFound("Tag not found.");

    await Member.updateMany({ gymId: req.user.gymId }, { $pull: { tagIds: tag._id } });
    await Tag.deleteOne({ _id: tag._id, gymId: req.user.gymId });

    await writeAudit({
      gymId: req.user.gymId,
      actorId: req.user.id,
      entity: "members",
      entityId: String(tag._id),
      action: "delete_tag",
      oldValues: { name: tag.name, color: tag.color },
    });

    res.status(204).end();
  }),
);

export default router;
