import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { z } from "zod";
import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { users, stripeSubscriptions } from "../../drizzle/schema";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2024-12-18",
});

export const stripeRouter = router({
  /**
   * Create a checkout session for a subscription plan
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        planSlug: z.enum(["starter", "professional", "enterprise"]),
        billingCycle: z.enum(["monthly", "annual"]).default("monthly"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const db = await getDb();
        if (!db) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Database not available",
          });
        }

        // Get or create Stripe customer
        let stripeCustomerId = ctx.user.stripeCustomerId;

        if (!stripeCustomerId) {
          const customer = await stripe.customers.create({
            email: ctx.user.email || undefined,
            name: ctx.user.name || undefined,
            metadata: {
              userId: ctx.user.id.toString(),
            },
          });

          stripeCustomerId = customer.id;

          // Update user with Stripe customer ID
          await db
            .update(users)
            .set({ stripeCustomerId })
            .where(eq(users.id, ctx.user.id));
        }

        // Map plan slug to price ID
        const priceMap: Record<string, string> = {
          starter_monthly: process.env.STRIPE_STARTER_MONTHLY_PRICE_ID || "",
          starter_annual: process.env.STRIPE_STARTER_ANNUAL_PRICE_ID || "",
          professional_monthly:
            process.env.STRIPE_PROFESSIONAL_MONTHLY_PRICE_ID || "",
          professional_annual:
            process.env.STRIPE_PROFESSIONAL_ANNUAL_PRICE_ID || "",
          enterprise_monthly:
            process.env.STRIPE_ENTERPRISE_MONTHLY_PRICE_ID || "",
          enterprise_annual: process.env.STRIPE_ENTERPRISE_ANNUAL_PRICE_ID || "",
        };

        const priceId =
          priceMap[`${input.planSlug}_${input.billingCycle}`] || "";

        if (!priceId) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invalid plan or billing cycle",
          });
        }

        // Create checkout session
        const session = await stripe.checkout.sessions.create({
          customer: stripeCustomerId,
          line_items: [
            {
              price: priceId,
              quantity: 1,
            },
          ],
          mode: "subscription",
          success_url: `${ctx.req.headers.origin}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
          cancel_url: `${ctx.req.headers.origin}/plans`,
          metadata: {
            userId: ctx.user.id.toString(),
            planSlug: input.planSlug,
          },
          allow_promotion_codes: true,
        });

        return {
          checkoutUrl: session.url,
          sessionId: session.id,
        };
      } catch (error) {
        console.error("[Stripe] Checkout session error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create checkout session",
        });
      }
    }),

  /**
   * Get subscription status for current user
   */
  getSubscriptionStatus: protectedProcedure.query(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) {
        return null;
      }

      const subscription = await db
        .select()
        .from(stripeSubscriptions)
        .where(eq(stripeSubscriptions.userId, ctx.user.id))
        .limit(1);

      if (subscription.length === 0) {
        return null;
      }

      return subscription[0];
    } catch (error) {
      console.error("[Stripe] Get subscription error:", error);
      return null;
    }
  }),

  /**
   * Cancel subscription
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    try {
      const db = await getDb();
      if (!db) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Database not available",
        });
      }

      const subscription = await db
        .select()
        .from(stripeSubscriptions)
        .where(eq(stripeSubscriptions.userId, ctx.user.id))
        .limit(1);

      if (subscription.length === 0) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "No active subscription found",
        });
      }

      // Cancel with Stripe
      await stripe.subscriptions.cancel(subscription[0].stripeSubscriptionId);

      // Update local record
      await db
        .update(stripeSubscriptions)
        .set({
          status: "cancelled",
          canceledAt: new Date(),
        })
        .where(eq(stripeSubscriptions.id, subscription[0].id));

      return { success: true };
    } catch (error) {
      console.error("[Stripe] Cancel subscription error:", error);
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to cancel subscription",
      });
    }
  }),

  /**
   * Retrieve checkout session (for success page)
   */
  getCheckoutSession: publicProcedure
    .input(z.object({ sessionId: z.string() }))
    .query(async ({ input }) => {
      try {
        const session = await stripe.checkout.sessions.retrieve(input.sessionId);
        return {
          id: session.id,
          status: session.payment_status,
          customerEmail: session.customer_email,
          subscriptionId: session.subscription,
        };
      } catch (error) {
        console.error("[Stripe] Get session error:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to retrieve session",
        });
      }
    }),
});
