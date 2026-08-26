import type { AgeIssue } from "@/lib/validation/age";
import type { AdviceBodyIssue } from "@/lib/validation/advice-body";

export type ContributionFieldIssues = {
  minimumAge?: AgeIssue;
  maximumAge?: AgeIssue;
  order?: true;
  body?: AdviceBodyIssue;
};

export type ContributionResult =
  | { kind: "received" }
  | { kind: "invalid"; fields: ContributionFieldIssues }
  | { kind: "unavailable" }
  | { kind: "rate-limited" };
