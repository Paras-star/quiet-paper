export type ReportResult =
  | { kind: "received" }
  | { kind: "unavailable" }
  | { kind: "rate-limited" };
