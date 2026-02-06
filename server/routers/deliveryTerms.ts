import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getDeliveryTermsByInspection,
  getDeliveryTermById,
  getUserDeliveryTerms,
  createDeliveryTerm,
  updateDeliveryTerm,
  deleteDeliveryTerm,
  generateProtocolNumber,
} from "../db-features";

export const deliveryTermsRouter = router({
  // Get all delivery terms for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    return getUserDeliveryTerms(ctx.user.id);
  }),

  // Get a specific delivery term
  getById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      return getDeliveryTermById(input.id);
    }),

  // Get delivery term by inspection ID
  getByInspection: protectedProcedure
    .input(z.object({ inspectionId: z.number() }))
    .query(async ({ input }) => {
      return getDeliveryTermsByInspection(input.inspectionId);
    }),

  // Create a new delivery term
  create: protectedProcedure
    .input(
      z.object({
        inspectionId: z.number(),
        companyId: z.number().optional(),
        responsibleTechnician: z.string().min(1),
        description: z.string().optional(),
        completionDate: z.date(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const protocolNumber = await generateProtocolNumber();

      return createDeliveryTerm({
        inspectionId: input.inspectionId,
        userId: ctx.user.id,
        companyId: input.companyId,
        protocolNumber,
        completionDate: input.completionDate,
        responsibleTechnician: input.responsibleTechnician,
        description: input.description,
        status: "draft",
      });
    }),

  // Update a delivery term
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        responsibleTechnician: z.string().optional(),
        description: z.string().optional(),
        digitalSignature: z.string().optional(),
        pdfUrl: z.string().optional(),
        status: z.enum(["draft", "signed", "archived"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...updates } = input;
      return updateDeliveryTerm(id, updates);
    }),

  // Delete a delivery term
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      return deleteDeliveryTerm(input.id);
    }),
});
