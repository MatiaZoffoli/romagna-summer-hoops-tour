import { describe, it, expect } from "vitest";
import { findNextPromoTappa, sortClassifica } from "./data";
import type { DbTappa } from "@/lib/types";
import type { SquadraConPunti } from "@/lib/types";

describe("findNextPromoTappa", () => {
  const baseTappa = (overrides: Partial<DbTappa>): DbTappa =>
    ({
      id: "t1",
      slug: "t1",
      nome: "Tappa",
      nome_completo: null,
      data: "15 Luglio 2026",
      orario: "16:00",
      luogo: "Rimini",
      indirizzo: null,
      provincia: null,
      organizzatore: null,
      contatto_organizzatore: null,
      instagram: null,
      descrizione: null,
      stato: "confermata",
      lat: null,
      lng: null,
      created_at: new Date().toISOString(),
      ...overrides,
    }) as DbTappa;

  it("returns tappa when date is within next 7 days", () => {
    const now = new Date(2026, 6, 10); // 10 July 2026
    const tappe: DbTappa[] = [
      baseTappa({ id: "a", data: "15 Luglio 2026", stato: "confermata" }),
    ];
    const result = findNextPromoTappa(tappe, now);
    expect(result).not.toBeNull();
    expect(result!.id).toBe("a");
  });

  it("returns null when no tappa in window", () => {
    const now = new Date(2026, 6, 1);
    const tappe: DbTappa[] = [
      baseTappa({ id: "a", data: "30 Luglio 2026", stato: "confermata" }),
    ];
    const result = findNextPromoTappa(tappe, now);
    expect(result).toBeNull();
  });

  it("ignores tappa with stato pending", () => {
    const now = new Date(2026, 6, 10);
    const tappe: DbTappa[] = [
      baseTappa({ id: "a", data: "15 Luglio 2026", stato: "pending" }),
    ];
    const result = findNextPromoTappa(tappe, now);
    expect(result).toBeNull();
  });

  it("returns first matching tappa when multiple in window", () => {
    const now = new Date(2026, 6, 10);
    const tappe: DbTappa[] = [
      baseTappa({ id: "b", data: "17 Luglio 2026", stato: "confermata" }),
      baseTappa({ id: "a", data: "12 Luglio 2026", stato: "confermata" }),
    ];
    const result = findNextPromoTappa(tappe, now);
    expect(result).not.toBeNull();
    expect(result!.id).toBe("b");
  });
});

describe("sortClassifica", () => {
  const baseSquadra = (overrides: Partial<SquadraConPunti>): SquadraConPunti =>
    ({
      id: "s1",
      auth_user_id: null,
      nome: "Squadra",
      motto: null,
      instagram: null,
      email: null,
      telefono: null,
      admin_notes: null,
      logo_url: null,
      avatar_icon: null,
      avatar_color: null,
      generated_logo_url: null,
      logo_generated_at: null,
      created_at: new Date().toISOString(),
      giocatori: [],
      punti_totali: 0,
      tappe_giocate: 0,
      risultati: [],
      ...overrides,
    }) as SquadraConPunti;

  it("sorts by punti_totali descending", () => {
    const squadre: SquadraConPunti[] = [
      baseSquadra({ id: "a", nome: "A", punti_totali: 50 }),
      baseSquadra({ id: "b", nome: "B", punti_totali: 100 }),
      baseSquadra({ id: "c", nome: "C", punti_totali: 75 }),
    ];
    const sorted = sortClassifica(squadre, null);
    expect(sorted.map((s) => s.id)).toEqual(["b", "c", "a"]);
  });

  it("then by tappe_giocate descending when punti equal", () => {
    const squadre: SquadraConPunti[] = [
      baseSquadra({ id: "a", punti_totali: 100, tappe_giocate: 2 }),
      baseSquadra({ id: "b", punti_totali: 100, tappe_giocate: 4 }),
      baseSquadra({ id: "c", punti_totali: 100, tappe_giocate: 3 }),
    ];
    const sorted = sortClassifica(squadre, null);
    expect(sorted.map((s) => s.id)).toEqual(["b", "c", "a"]);
  });

  it("then by average position ascending when punti and tappe equal", () => {
    const squadre: SquadraConPunti[] = [
      baseSquadra({
        id: "a",
        punti_totali: 100,
        tappe_giocate: 2,
        risultati: [{ posizione: 3, tappa_id: "t1", tappa_slug: "t1" } as unknown as SquadraConPunti["risultati"][0], { posizione: 5, tappa_id: "t2", tappa_slug: "t2" } as unknown as SquadraConPunti["risultati"][0]],
      }),
      baseSquadra({
        id: "b",
        punti_totali: 100,
        tappe_giocate: 2,
        risultati: [{ posizione: 1, tappa_id: "t1", tappa_slug: "t1" } as unknown as SquadraConPunti["risultati"][0], { posizione: 2, tappa_id: "t2", tappa_slug: "t2" } as unknown as SquadraConPunti["risultati"][0]],
      }),
    ];
    const sorted = sortClassifica(squadre, null);
    expect(sorted[0].id).toBe("b");
    expect(sorted[1].id).toBe("a");
  });

  it("then by last tappa position when lastTappaId provided", () => {
    const squadre: SquadraConPunti[] = [
      baseSquadra({
        id: "a",
        punti_totali: 100,
        tappe_giocate: 2,
        risultati: [
          { posizione: 2, tappa_id: "t1", tappa_slug: "t1" } as unknown as SquadraConPunti["risultati"][0],
          { posizione: 3, tappa_id: "t2", tappa_slug: "t2" } as unknown as SquadraConPunti["risultati"][0],
        ],
      }),
      baseSquadra({
        id: "b",
        punti_totali: 100,
        tappe_giocate: 2,
        risultati: [
          { posizione: 1, tappa_id: "t1", tappa_slug: "t1" } as unknown as SquadraConPunti["risultati"][0],
          { posizione: 4, tappa_id: "t2", tappa_slug: "t2" } as unknown as SquadraConPunti["risultati"][0],
        ],
      }),
    ];
    const sorted = sortClassifica(squadre, "t2");
    expect(sorted[0].id).toBe("a");
    expect(sorted[1].id).toBe("b");
  });
});
