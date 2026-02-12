import { describe, it, expect } from "vitest";
import { tappe, squadre, news } from "./placeholder";

const VALID_STATI = ["pending", "confermata", "in_corso", "in_attesa_risultati", "conclusa"] as const;

describe("placeholder data", () => {
  describe("tappe", () => {
    it("has at least one tappa", () => {
      expect(tappe.length).toBeGreaterThanOrEqual(1);
    });

    it("every tappa has required fields", () => {
      for (const t of tappe) {
        expect(t.id).toBeDefined();
        expect(typeof t.id).toBe("string");
        expect(t.nome).toBeDefined();
        expect(t.data).toBeDefined();
        expect(t.luogo).toBeDefined();
        expect(t.stato).toBeDefined();
      }
    });

    it("every tappa has a valid stato", () => {
      for (const t of tappe) {
        expect(VALID_STATI).toContain(t.stato);
      }
    });
  });

  describe("squadre", () => {
    it("every squadra has required fields", () => {
      for (const s of squadre) {
        expect(s.id).toBeDefined();
        expect(s.nome).toBeDefined();
        expect(Array.isArray(s.giocatori)).toBe(true);
        expect(typeof s.puntiTotali).toBe("number");
        expect(typeof s.tappeGiocate).toBe("number");
      }
    });
  });

  describe("news", () => {
    it("every news item has required fields", () => {
      for (const n of news) {
        expect(n.id).toBeDefined();
        expect(n.titolo).toBeDefined();
        expect(n.contenuto).toBeDefined();
        expect(n.data).toBeDefined();
        expect(n.anteprima).toBeDefined();
      }
    });
  });
});
