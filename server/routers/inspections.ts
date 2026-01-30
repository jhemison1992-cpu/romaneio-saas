import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getUserInspections,
  getInspectionById,
  createInspection,
  updateInspection,
  deleteInspection,
} from "../db-features";

export const inspectionsRouter = router({
  // Get all inspections for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    return getUserInspections(ctx.user.id);
  }),

  // Get a specific inspection
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getInspectionById(input.id);
    }),

  // Create a new inspection
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        location: z.string().optional(),
        date: z.date(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      return createInspection({
        userId: ctx.user.id,
        title: input.title,
        location: input.location,
        date: input.date,
        notes: input.notes,
        status: "pending",
      });
    }),

  // Update an inspection
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        location: z.string().optional(),
        date: z.date().optional(),
        status: z.enum(["pending", "completed", "cancelled"]).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      return updateInspection(id, updates);
    }),

  // Delete an inspection
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteInspection(input.id);
    }),
});
