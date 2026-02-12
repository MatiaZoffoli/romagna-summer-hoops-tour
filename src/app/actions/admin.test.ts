import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  updateTappaStatus,
  addTappaResult,
  addNews,
  addTappa,
  getAdminData,
  sendTestEmail,
} from "./admin";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const mockSupabaseChain = {
  update: vi.fn().mockReturnThis(),
  eq: vi.fn().mockResolvedValue({ error: null }),
  insert: vi.fn().mockResolvedValue({ error: null }),
  upsert: vi.fn().mockResolvedValue({ error: null }),
  select: vi.fn().mockReturnThis(),
  order: vi.fn().mockResolvedValue({ data: [], error: null }),
  single: vi.fn().mockResolvedValue({ data: null, error: null }),
};
const mockFrom = vi.fn(() => mockSupabaseChain);

vi.mock("@/lib/supabase/server", () => ({
  createServiceRoleClient: () => ({ from: mockFrom }),
}));

describe("admin actions", () => {
  const adminPassword = "test-admin-123";

  beforeEach(() => {
    process.env.ADMIN_PASSWORD = adminPassword;
    mockFrom.mockReturnValue(mockSupabaseChain);
    mockSupabaseChain.eq.mockResolvedValue({ error: null });
    mockSupabaseChain.upsert.mockResolvedValue({ error: null });
    mockSupabaseChain.insert.mockResolvedValue({ error: null });
    mockSupabaseChain.order.mockResolvedValue({ data: [], error: null });
    mockSupabaseChain.single.mockResolvedValue({ data: null, error: null });
  });

  afterEach(() => {
    delete process.env.ADMIN_PASSWORD;
    vi.clearAllMocks();
  });

  describe("updateTappaStatus", () => {
    it("returns error when admin password is invalid", async () => {
      const formData = new FormData();
      formData.set("adminPassword", "wrong");
      formData.set("tappaId", "tappa-1");
      formData.set("stato", "confermata");

      const result = await updateTappaStatus(formData);
      expect(result).toEqual({ error: "Password admin non valida." });
    });

    it("returns success when password is valid and Supabase succeeds", async () => {
      const formData = new FormData();
      formData.set("adminPassword", adminPassword);
      formData.set("tappaId", "tappa-1");
      formData.set("stato", "confermata");

      const result = await updateTappaStatus(formData);
      expect(result).toEqual({ success: true });
    });
  });

  describe("addTappaResult", () => {
    it("returns error when admin password is invalid", async () => {
      const formData = new FormData();
      formData.set("adminPassword", "wrong");
      formData.set("tappaId", "tappa-1");
      formData.set("squadraId", "squadra-1");
      formData.set("posizione", "1");
      formData.set("punti", "100");

      const result = await addTappaResult(formData);
      expect(result).toEqual({ error: "Password admin non valida." });
    });

    it("returns error when required fields are missing", async () => {
      const formData = new FormData();
      formData.set("adminPassword", adminPassword);
      formData.set("tappaId", "tappa-1");

      const result = await addTappaResult(formData);
      expect(result).toEqual({ error: "Tutti i campi sono obbligatori." });
    });

    it("returns success when all fields valid and Supabase succeeds", async () => {
      const formData = new FormData();
      formData.set("adminPassword", adminPassword);
      formData.set("tappaId", "tappa-1");
      formData.set("squadraId", "squadra-1");
      formData.set("posizione", "1");
      formData.set("punti", "100");

      const result = await addTappaResult(formData);
      expect(result).toEqual({ success: true });
    });
  });

  describe("addNews", () => {
    it("returns error when admin password is invalid", async () => {
      const formData = new FormData();
      formData.set("adminPassword", "wrong");
      formData.set("titolo", "Title");
      formData.set("contenuto", "Content");
      formData.set("anteprima", "Preview");

      const result = await addNews(formData);
      expect(result).toEqual({ error: "Password admin non valida." });
    });

    it("returns error when required fields are missing", async () => {
      const formData = new FormData();
      formData.set("adminPassword", adminPassword);
      formData.set("titolo", "Title");

      const result = await addNews(formData);
      expect(result).toEqual({ error: "Tutti i campi sono obbligatori." });
    });
  });

  describe("addTappa", () => {
    it("returns error when admin password is invalid", async () => {
      const formData = new FormData();
      formData.set("adminPassword", "wrong");
      formData.set("nome", "Test");
      formData.set("data", "2026-07-01");
      formData.set("luogo", "Rimini");

      const result = await addTappa(formData);
      expect(result).toEqual({ error: "Password admin non valida." });
    });

    it("returns error when nome, data or luogo are missing", async () => {
      const formData = new FormData();
      formData.set("adminPassword", adminPassword);
      formData.set("nome", "Test");

      const result = await addTappa(formData);
      expect(result).toEqual({ error: "Nome, data e luogo sono obbligatori." });
    });
  });

  describe("getAdminData", () => {
    it("returns null when password is invalid", async () => {
      const result = await getAdminData("wrong");
      expect(result).toBeNull();
    });

    it("returns data shape when password is valid", async () => {
      const result = await getAdminData(adminPassword);
      expect(result).toEqual({
        tappe: [],
        squadre: [],
        risultati: [],
        news: [],
        applications: [],
      });
    });
  });

  describe("sendTestEmail", () => {
    it("returns error when password is invalid", async () => {
      const result = await sendTestEmail("wrong");
      expect(result).toEqual({ error: "Password admin non valida." });
    });
  });
});
