import { describe, it, expect, beforeEach, vi } from "vitest";
import { generateProtocolNumber } from "../db-features";

describe("Delivery Terms", () => {
  describe("generateProtocolNumber", () => {
    it("should generate a unique protocol number", async () => {
      const protocol1 = await generateProtocolNumber();
      const protocol2 = await generateProtocolNumber();

      expect(protocol1).toMatch(/^TERMO-\d+-\d+$/);
      expect(protocol2).toMatch(/^TERMO-\d+-\d+$/);
      expect(protocol1).not.toBe(protocol2);
    });

    it("should generate protocol number with correct format", async () => {
      const protocol = await generateProtocolNumber();

      const parts = protocol.split("-");
      expect(parts.length).toBe(3);
      expect(parts[0]).toBe("TERMO");
      expect(!isNaN(parseInt(parts[1]))).toBe(true);
      expect(!isNaN(parseInt(parts[2]))).toBe(true);
    });

    it("should generate protocol number with timestamp", async () => {
      const beforeTime = Date.now();
      const protocol = await generateProtocolNumber();
      const afterTime = Date.now();

      const parts = protocol.split("-");
      const timestamp = parseInt(parts[1]);

      expect(timestamp).toBeGreaterThanOrEqual(beforeTime);
      expect(timestamp).toBeLessThanOrEqual(afterTime);
    });

    it("should generate protocol number with random suffix", async () => {
      const protocols = await Promise.all(
        Array.from({ length: 5 }, () => generateProtocolNumber())
      );

      // Extract random suffixes
      const suffixes = protocols.map((p) => {
        const parts = p.split("-");
        return parseInt(parts[2]);
      });

      // Check that suffixes are within expected range
      suffixes.forEach((suffix) => {
        expect(suffix).toBeGreaterThanOrEqual(0);
        expect(suffix).toBeLessThan(10000);
      });
    });
  });
});
