import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import {
  getSubscriptionPlans,
  getUserActiveSubscription,
  createUserSubscription,
  seedSubscriptionPlans,
} from "../db-features";

export const subscriptionRouter = router({
  // Get all available subscription plans
  listPlans: protectedProcedure.query(async () => {
    await seedSubscriptionPlans();
    return getSubscriptionPlans();
  }),

  // Get user's current subscription
  getCurrentSubscription: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user) return null;
    const subscription = await getUserActiveSubscription(ctx.user.id);
    return subscription || null;
  }),

  // Create a new subscription for the user
  subscribe: protectedProcedure
    .input(
      z.object({
        planSlug: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user) {
        throw new Error("User not authenticated");
      }

      const { planSlug } = input;
      const plans = await getSubscriptionPlans();
      const plan = plans.find((p) => p.slug === planSlug);

      if (!plan) {
        throw new Error("Plan not found");
      }

      const now = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);

      await createUserSubscription({
        userId: ctx.user.id,
        planId: plan.id,
        startDate: now,
        endDate: endDate,
        status: "active",
        autoRenew: true,
      });

      return { success: true, plan };
    }),
});
