import { describe, expect, it } from "vitest";
import { consumeRateLimit } from "@/lib/security/rate-limit";
describe("consumeRateLimit", () => {
  it("allows requests below the contribute limit and blocks the next", () => {
    const key = `contribute-test-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 5; i += 1) {
      expect(consumeRateLimit("contribute", key)).toBe("allow");
    }
    expect(consumeRateLimit("contribute", key)).toBe("limited");

  });
  it("isolates keys and scopes", () => {
    const stamp = `${Date.now()}-${Math.random()}`;
    const a = `iso-a-${stamp}`;
    const b = `iso-b-${stamp}`;
    for (let i = 0; i < 5; i += 1) {
      expect(consumeRateLimit("contribute", a)).toBe("allow");
    }
    expect(consumeRateLimit("contribute", a)).toBe("limited");
    expect(consumeRateLimit("contribute", b)).toBe("allow");
    expect(consumeRateLimit("report", a)).toBe("allow");
  });
  it("enforces the report limit independently", () => {
    const key = `report-test-${Date.now()}-${Math.random()}`;
    for (let i = 0; i < 8; i += 1) {
      expect(consumeRateLimit("report", key)).toBe("allow");
    }

    expect(consumeRateLimit("report", key)).toBe("limited");
  });
});
