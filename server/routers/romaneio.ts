import { z } from "zod";
import { getDb } from "../db";
import { romaneios } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getUserRomaneios,
  getRomaneioById,
  createRomaneio,
  updateRomaneio,
  getRomaneioItems,
  createRomaneioItem,
  deleteRomaneioItem,
  updateRomaneioItem,
  getUserActiveSubscription,
  getSubscriptionPlanBySlug,
} from "../db-features";


export const romaneioRouter = router({
  // List all romaneios for the current user
  list: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return [];
    return getUserRomaneios(ctx.user.id);
  }),

  // Get a specific romaneio with its items
  get: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      if (!ctx.user) return null;

      const romaneio = await getRomaneioById(input.id);
      if (!romaneio || romaneio.userId !== ctx.user.id) {
        throw new Error("Romaneio not found or unauthorized");
      }

      const items = await getRomaneioItems(input.id);
      return { ...romaneio, items };
    }),

  // Create a new romaneio
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(1),
        remetente: z.string().min(1),
        destinatario: z.string().min(1),
        dataEmissao: z.date(),
        observacoes: z.string().optional(),
        responsavel: z.string().optional(),
        tipoContrato: z.string().optional(),
        contratante: z.string().optional(),
        dataInicio: z.date().optional(),
        previsaoTermino: z.date().optional(),
        numeroContrato: z.string().optional(),
        endereco: z.string().optional(),
        valor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      // Check subscription limits
      const subscription = await getUserActiveSubscription(ctx.user.id);
      if (!subscription) {
        throw new Error("No active subscription");
      }

      const userRomaneios = await getUserRomaneios(ctx.user.id);
      const plans = await getSubscriptionPlanBySlug("free");

      if (userRomaneios.length >= (plans?.maxRomaneios || 5)) {
        throw new Error("Subscription limit reached");
      }

      const result = await createRomaneio({
        userId: ctx.user.id,
        title: input.title,
        remetente: input.remetente,
        destinatario: input.destinatario,
        dataEmissao: input.dataEmissao,
        observacoes: input.observacoes,
        status: "draft",
      });

      return result;
    }),

  // Update a romaneio
  update: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        title: z.string().optional(),
        remetente: z.string().optional(),
        destinatario: z.string().optional(),
        dataEmissao: z.date().optional(),
        dataEntrega: z.date().optional(),
        status: z.enum(["draft", "completed", "archived"]).optional(),
        observacoes: z.string().optional(),
        responsavel: z.string().optional(),
        tipoContrato: z.string().optional(),
        contratante: z.string().optional(),
        dataInicio: z.date().optional(),
        previsaoTermino: z.date().optional(),
        numeroContrato: z.string().optional(),
        endereco: z.string().optional(),
        valor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const romaneio = await getRomaneioById(input.id);
      if (!romaneio || romaneio.userId !== ctx.user.id) {
        throw new Error("Romaneio not found or unauthorized");
      }

      const { id, ...updates } = input;
      await updateRomaneio(id, updates);

      return { success: true };
    }),

  // Delete a romaneio
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const romaneio = await getRomaneioById(input.id);
      if (!romaneio || romaneio.userId !== ctx.user.id) {
        throw new Error("Romaneio not found or unauthorized");
      }

      // Delete all items first
      const items = await getRomaneioItems(input.id);
      for (const item of items) {
        await deleteRomaneioItem(item.id);
      }

      // Delete the romaneio from database
      const db = await getDb();
      if (db) {
        await db.delete(romaneios).where(eq(romaneios.id, input.id));
      }
      return { success: true };
    }),

  // Add item to romaneio
  addItem: protectedProcedure
    .input(
      z.object({
        romaneioId: z.number(),
        descricao: z.string().min(1),
        quantidade: z.number().min(1),
        peso: z.string().optional(),
        unidade: z.string().default("kg"),
        valor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const romaneio = await getRomaneioById(input.romaneioId);
      if (!romaneio || romaneio.userId !== ctx.user.id) {
        throw new Error("Romaneio not found or unauthorized");
      }

      const { romaneioId, ...itemData } = input;
      const result = await createRomaneioItem({
        romaneioId,
        ...itemData,
      });

      return result;
    }),

  // Update item in romaneio
  updateItem: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        romaneioId: z.number(),
        descricao: z.string().optional(),
        quantidade: z.number().optional(),
        peso: z.string().optional(),
        unidade: z.string().optional(),
        valor: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const romaneio = await getRomaneioById(input.romaneioId);
      if (!romaneio || romaneio.userId !== ctx.user.id) {
        throw new Error("Romaneio not found or unauthorized");
      }

      const { itemId, romaneioId, ...updates } = input;
      await updateRomaneioItem(itemId, updates);

      return { success: true };
    }),

  // Remove item from romaneio
  removeItem: protectedProcedure
    .input(
      z.object({
        itemId: z.number(),
        romaneioId: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const romaneio = await getRomaneioById(input.romaneioId);
      if (!romaneio || romaneio.userId !== ctx.user.id) {
        throw new Error("Romaneio not found or unauthorized");
      }

      await deleteRomaneioItem(input.itemId);
      return { success: true };
    }),

});
