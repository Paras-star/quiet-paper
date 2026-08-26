import "server-only";
import { headers } from "next/headers";

/**
 * Coarse key for abuse dampening only. Not identity, not authorization.
 * Uses the first X-Forwarded-For hop when present (typical behind Vercel).
 * Do not log this value next to ages or advice text.
 */
export async function coarseClientKey(): Promise<string> {
  try {
    const headerList = await headers();
    const forwarded = headerList.get("x-forwarded-for");
    const forwardedFirst = forwarded?.split(",")[0]?.trim();
    const realIp = headerList.get("x-real-ip")?.trim();
    const candidate = forwardedFirst || realIp;
    if (candidate) {
      return `ip:${candidate}`;
    }
    return "unknown";
  } catch {
    return "unknown";
  }
}
