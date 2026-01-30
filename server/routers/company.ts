import { protectedProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

export const companyRouter = router({
  /**
   * Save company information for the current user
   */
  setupCompany: protectedProcedure
    .input(
      z.object({
        companyName: z.string().min(1, "Nome da empresa é obrigatório"),
        documentNumber: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        preferredTemplate: z.enum(["blank", "aluminc"]).default("blank"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      try {
        await db
          .update(users)
          .set({
            companyName: input.companyName,
            documentNumber: input.documentNumber || null,
            phone: input.phone || null,
            address: input.address || null,
            preferredTemplate: input.preferredTemplate,
            updatedAt: new Date(),
          })
          .where(eq(users.id, ctx.user.id));

        return {
          success: true,
          message: "Empresa configurada com sucesso",
        };
      } catch (error) {
        console.error("[Company] Setup failed:", error);
        throw error;
      }
    }),

  /**
   * Get current user's company information
   */
  getCompanyInfo: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) return null;

    try {
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, ctx.user.id))
        .limit(1);

      if (user.length === 0) return null;

      return {
        companyName: user[0].companyName,
        documentNumber: user[0].documentNumber,
        phone: user[0].phone,
        address: user[0].address,
        preferredTemplate: user[0].preferredTemplate,
      };
    } catch (error) {
      console.error("[Company] Get info failed:", error);
      return null;
    }
  }),
});
