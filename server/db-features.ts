import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import {
  subscriptionPlans,
  userSubscriptions,
  companies,
  romaneios,
  romaneioItems,
  inspections,
  deliveryTerms,
  InsertSubscriptionPlan,
  InsertUserSubscription,
  InsertCompany,
  InsertRomaneio,
  InsertRomaneioItem,
  InsertInspection,
  InsertDeliveryTerm,
} from "../drizzle/schema";

/**
 * Subscription Plans Management
 */

export async function getSubscriptionPlans() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.isActive, true))
    .orderBy(subscriptionPlans.monthlyPrice);
}

export async function getSubscriptionPlanBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(subscriptionPlans)
    .where(eq(subscriptionPlans.slug, slug))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createSubscriptionPlan(plan: InsertSubscriptionPlan) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptionPlans).values(plan);
  return result;
}

/**
 * User Subscriptions Management
 */

export async function getUserActiveSubscription(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(userSubscriptions)
    .where(
      and(
        eq(userSubscriptions.userId, userId),
        eq(userSubscriptions.status, "active")
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createUserSubscription(
  subscription: InsertUserSubscription
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(userSubscriptions).values(subscription);
}

/**
 * Companies Management
 */

export async function getUserCompanies(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(companies)
    .where(eq(companies.ownerId, userId));
}

export async function getCompanyById(companyId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(companies)
    .where(eq(companies.id, companyId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createCompany(company: InsertCompany) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(companies).values(company);
}

/**
 * Romaneios Management
 */

export async function getUserRomaneios(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(romaneios)
    .where(eq(romaneios.userId, userId))
    .orderBy(desc(romaneios.createdAt));
}

export async function getRomaneioById(romaneioId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(romaneios)
    .where(eq(romaneios.id, romaneioId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createRomaneio(romaneio: InsertRomaneio) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(romaneios).values(romaneio);
  return result;
}

export async function updateRomaneio(
  romaneioId: number,
  updates: Partial<InsertRomaneio>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(romaneios)
    .set(updates)
    .where(eq(romaneios.id, romaneioId));
}

/**
 * Romaneio Items Management
 */

export async function getRomaneioItems(romaneioId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(romaneioItems)
    .where(eq(romaneioItems.romaneioId, romaneioId));
}

export async function createRomaneioItem(item: InsertRomaneioItem) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(romaneioItems).values(item);
}

export async function deleteRomaneioItem(itemId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .delete(romaneioItems)
    .where(eq(romaneioItems.id, itemId));
}

export async function updateRomaneioItem(
  itemId: number,
  updates: Partial<InsertRomaneioItem>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(romaneioItems)
    .set(updates)
    .where(eq(romaneioItems.id, itemId));
}

/**
 * Seed default subscription plans
 */

export async function seedSubscriptionPlans() {
  const db = await getDb();
  if (!db) return;

  const existingPlans = await db
    .select()
    .from(subscriptionPlans)
    .limit(1);

  if (existingPlans.length > 0) {
    return; // Plans already seeded
  }

  const plans: InsertSubscriptionPlan[] = [
    {
      name: "Starter",
      slug: "starter",
      description: "Perfeito para pequenas empresas",
      monthlyPrice: "79.90",
      features: [
        "romaneios_ilimitados",
        "ate_3_usuarios",
        "relatorios_basicos",
        "suporte_email",
      ],
      maxRomaneios: 100,
      maxUsers: 3,
      isActive: true,
    },
    {
      name: "Profissional",
      slug: "professional",
      description: "Para empresas em crescimento",
      monthlyPrice: "159.80",
      features: [
        "romaneios_ilimitados",
        "ate_10_usuarios",
        "relatorios_avancados",
        "api_acesso",
        "suporte_prioritario",
        "integracao_nfe",
      ],
      maxRomaneios: 1000,
      maxUsers: 10,
      isActive: true,
    },
    {
      name: "Enterprise",
      slug: "enterprise",
      description: "Solução completa para grandes empresas",
      monthlyPrice: "299.90",
      features: [
        "romaneios_ilimitados",
        "usuarios_ilimitados",
        "relatorios_customizados",
        "api_completa",
        "suporte_24_7",
        "integracao_nfe",
        "integracao_erp",
        "sso",
      ],
      maxRomaneios: 999999,
      maxUsers: 999999,
      isActive: true,
    },
  ];

  for (const plan of plans) {
    await db.insert(subscriptionPlans).values(plan);
  }
}


/**
 * Inspections/Vistorias Management
 */

export async function getUserInspections(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(inspections)
    .where(eq(inspections.userId, userId))
    .orderBy(desc(inspections.createdAt));
}

export async function getInspectionById(inspectionId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(inspections)
    .where(eq(inspections.id, inspectionId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createInspection(inspection: InsertInspection) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(inspections).values(inspection);
  return result;
}

export async function updateInspection(
  inspectionId: number,
  updates: Partial<InsertInspection>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(inspections)
    .set(updates)
    .where(eq(inspections.id, inspectionId));
}

export async function deleteInspection(inspectionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .delete(inspections)
    .where(eq(inspections.id, inspectionId));
}

/**
 * Delivery Terms Management
 */

export async function getDeliveryTermsByInspection(inspectionId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(deliveryTerms)
    .where(eq(deliveryTerms.inspectionId, inspectionId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getDeliveryTermById(termId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(deliveryTerms)
    .where(eq(deliveryTerms.id, termId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserDeliveryTerms(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(deliveryTerms)
    .where(eq(deliveryTerms.userId, userId))
    .orderBy(desc(deliveryTerms.createdAt));
}

export async function createDeliveryTerm(term: InsertDeliveryTerm) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(deliveryTerms).values(term);
  return result;
}

export async function updateDeliveryTerm(
  termId: number,
  updates: Partial<InsertDeliveryTerm>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(deliveryTerms)
    .set(updates)
    .where(eq(deliveryTerms.id, termId));
}

export async function deleteDeliveryTerm(termId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .delete(deliveryTerms)
    .where(eq(deliveryTerms.id, termId));
}

export async function generateProtocolNumber(): Promise<string> {
  const timestamp = Date.now();
  const random = Math.floor(Math.random() * 10000);
  return `TERMO-${timestamp}-${random}`;
}
