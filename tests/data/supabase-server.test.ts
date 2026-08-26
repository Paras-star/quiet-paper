import { afterEach, describe, expect, it, vi } from "vitest";
const { createClient } = vi.hoisted(() => ({
  createClient: vi.fn(),
}));

vi.mock("@supabase/supabase-js", () => ({ createClient }));
import { createServiceRoleClient } from "@/lib/data/supabase-server";
describe("createServiceRoleClient", () => {
  afterEach(() => {
    delete process.env.SUPABASE_URL;
    delete process.env.SUPABASE_SERVICE_ROLE_KEY;
    delete process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY;
    createClient.mockClear();
  });
  it("returns null without server credentials", () => {
    expect(createServiceRoleClient()).toBeNull();
    expect(createClient).not.toHaveBeenCalled();
  });
  it("does not use a NEXT_PUBLIC service-role env var", () => {
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = "public-should-be-ignored";

    expect(createServiceRoleClient()).toBeNull();
    expect(createClient).not.toHaveBeenCalled();
  });
  it("passes only server-side url and service-role key to the client factory", () => {
    process.env.SUPABASE_URL = "https://example.supabase.co";
    process.env.SUPABASE_SERVICE_ROLE_KEY = "test-service-role-not-a-real-secret";
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY = "public-should-be-ignored";
    createClient.mockReturnValue({ mocked: true });
    expect(createServiceRoleClient()).toEqual({ mocked: true });
    expect(createClient).toHaveBeenCalledTimes(1);
    expect(createClient.mock.calls[0]?.[0]).toBe("https://example.supabase.co");
    expect(createClient.mock.calls[0]?.[1]).toBe("test-service-role-not-a-real-secret");
    expect(createClient.mock.calls[0]?.[1]).not.toBe("public-should-be-ignored");
  });
});
