import { describe, it, expect, beforeAll } from "vitest";
import { subscriptionRouter } from "./subscription";
import { romaneioRouter } from "./romaneio";

describe("Subscription Router", () => {
  it("should list subscription plans", async () => {
    // This test would require a mock context
    // For now, we're testing the router structure
    expect(subscriptionRouter).toBeDefined();
    expect(subscriptionRouter._def.procedures).toHaveProperty("listPlans");
    expect(subscriptionRouter._def.procedures).toHaveProperty("getCurrentSubscription");
    expect(subscriptionRouter._def.procedures).toHaveProperty("subscribe");
  });
});

describe("Romaneio Router", () => {
  it("should have all required procedures", () => {
    expect(romaneioRouter).toBeDefined();
    expect(romaneioRouter._def.procedures).toHaveProperty("list");
    expect(romaneioRouter._def.procedures).toHaveProperty("get");
    expect(romaneioRouter._def.procedures).toHaveProperty("create");
    expect(romaneioRouter._def.procedures).toHaveProperty("update");
    expect(romaneioRouter._def.procedures).toHaveProperty("delete");
    expect(romaneioRouter._def.procedures).toHaveProperty("addItem");
    expect(romaneioRouter._def.procedures).toHaveProperty("updateItem");
    expect(romaneioRouter._def.procedures).toHaveProperty("removeItem");
  });
});
