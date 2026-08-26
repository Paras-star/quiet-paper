export type PublicAdviceItem = {
  id: string;
  body: string;
};

export type PublicAdvicePick =
  | { kind: "item"; age: number; item: PublicAdviceItem }
  | { kind: "exhausted"; age: number }
  | { kind: "invalid-age" }
  | { kind: "unavailable" }
  | { kind: "rate-limited" };
