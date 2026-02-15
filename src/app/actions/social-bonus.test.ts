import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { requestSocialBonus } from "./social-bonus";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));

const mockAuthGetUser = vi.fn();
const mockFrom = vi.fn();
const mockInsert = vi.fn().mockResolvedValue({ error: null });

vi.mock("@/lib/supabase/server", () => ({
  createClient: () =>
    Promise.resolve({
      auth: { getUser: mockAuthGetUser },
      from: mockFrom,
    }),
}));

describe("requestSocialBonus", () => {
  beforeEach(() => {
    mockAuthGetUser.mockResolvedValue({ data: { user: { id: "user-1" } } });
    mockInsert.mockResolvedValue({ error: null });
    mockFrom.mockImplementation((table: string) => {
      if (table === "squadre") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: { id: "squadra-1" } }),
        };
      }
      if (table === "social_bonus_requests") {
        return { insert: mockInsert };
      }
      return {};
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns error when not logged in", async () => {
    mockAuthGetUser.mockResolvedValue({ data: { user: null } });

    const formData = new FormData();
    formData.set("tappa_id", "tappa-1");

    const result = await requestSocialBonus(formData);
    expect(result).toEqual({ error: "Devi essere loggato." });
  });

  it("returns error when tappa_id is missing", async () => {
    const formData = new FormData();
    formData.set("link_to_post", "https://example.com/post");

    const result = await requestSocialBonus(formData);
    expect(result).toEqual({ error: "Seleziona una tappa." });
  });

  it("returns error when tappa_id is empty string", async () => {
    const formData = new FormData();
    formData.set("tappa_id", "   ");

    const result = await requestSocialBonus(formData);
    expect(result).toEqual({ error: "Seleziona una tappa." });
  });

  it("returns error when squadra not found", async () => {
    mockFrom.mockImplementation((table: string) => {
      if (table === "squadre") {
        return {
          select: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          single: vi.fn().mockResolvedValue({ data: null }),
        };
      }
      return { insert: vi.fn().mockResolvedValue({ error: null }) };
    });

    const formData = new FormData();
    formData.set("tappa_id", "tappa-1");

    const result = await requestSocialBonus(formData);
    expect(result).toEqual({ error: "Squadra non trovata." });
  });

  it("returns success when all valid and insert succeeds", async () => {
    const formData = new FormData();
    formData.set("tappa_id", "tappa-1");
    formData.set("link_to_post", "https://instagram.com/p/abc");

    const result = await requestSocialBonus(formData);
    expect(result).toEqual({ success: true });
    expect(mockFrom).toHaveBeenCalledWith("social_bonus_requests");
    expect(mockInsert).toHaveBeenCalledWith(
      expect.objectContaining({
        squadra_id: "squadra-1",
        tappa_id: "tappa-1",
        link_to_post: "https://instagram.com/p/abc",
        stato: "pending",
      })
    );
  });

  it("returns error when duplicate request (23505)", async () => {
    mockInsert.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key" },
    });

    const formData = new FormData();
    formData.set("tappa_id", "tappa-1");

    const result = await requestSocialBonus(formData);
    expect(result).toEqual({ error: "Hai già richiesto il bonus per questa tappa." });
  });
});
