import "server-only";
import type { ContributionResult } from "@/lib/domain/contribution";
import { createServiceRoleClient } from "@/lib/data/supabase-server";
import { parseContributionAgeRange } from "@/lib/validation/age";
import { parseAdviceBody } from "@/lib/validation/advice-body";

/**
 * Server-only community intake. Status and source are set here, never from the browser.
 * Successful insert is pending, not published.
 */
export async function insertCommunityAdvice(
  minimumAge: unknown,
  maximumAge: unknown,
  body: unknown,
): Promise<ContributionResult> {
  const range = parseContributionAgeRange(minimumAge, maximumAge);
  const parsedBody = parseAdviceBody(body);
  if (!range.ok || !parsedBody.ok) {
    return {
      kind: "invalid",
      fields: {
        ...(range.ok
          ? {}
          : {
              ...(range.minimumIssue ? { minimumAge: range.minimumIssue } : {}),
              ...(range.maximumIssue ? { maximumAge: range.maximumIssue } : {}),
              ...(range.order ? { order: true as const } : {}),
            }),
        ...(!parsedBody.ok ? { body: parsedBody.issue } : {}),
      },
    };
  }
  const client = createServiceRoleClient();
  if (!client) {
    return { kind: "unavailable" };
  }
  const { error } = await client.from("advice").insert({
    body: parsedBody.body,
    minimum_age: range.minimumAge,
    maximum_age: range.maximumAge,
    source_type: "community",
    status: "pending",
  });
  if (error) {
    console.error("Community advice insert failed");
    return { kind: "unavailable" };
  }
  return { kind: "received" };
}
