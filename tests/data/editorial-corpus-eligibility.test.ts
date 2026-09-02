import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

const AGE_22_ONLY =
  "At 22 I thought I was behind because everyone else seemed to have life figured out. Looking back, almost nobody did.";
const AGE_21_ONLY = "21 is very young, you are not really missing out of your 20s.";

type CorpusPiece = {
  body: string;
  minimum_age: number;
  maximum_age: number;
};

function loadCorpus(): CorpusPiece[] {
  return JSON.parse(readFileSync("fixtures/editorial/editorial-corpus.json", "utf8")) as CorpusPiece[];
}

function eligibleAt(pieces: CorpusPiece[], age: number): CorpusPiece[] {
  return pieces.filter((piece) => piece.minimum_age <= age && piece.maximum_age >= age);
}

describe("editorial corpus exact-age targeting", () => {
  it("stores the 21-only piece as min_age = max_age = 21", () => {
    const matches = loadCorpus().filter((piece) => piece.body === AGE_21_ONLY);
    expect(matches).toEqual([
      {
        body: AGE_21_ONLY,
        minimum_age: 21,
        maximum_age: 21,
      },
    ]);
  });

  it("stores the 22-only piece as min_age = max_age = 22", () => {
    const matches = loadCorpus().filter((piece) => piece.body === AGE_22_ONLY);
    expect(matches).toEqual([
      {
        body: AGE_22_ONLY,
        minimum_age: 22,
        maximum_age: 22,
      },
    ]);
  });

  it("includes the 21-only piece with other age-21 advice, not neighbouring ages", () => {
    const corpus = loadCorpus();
    const at20 = eligibleAt(corpus, 20).map((piece) => piece.body);
    const at21 = eligibleAt(corpus, 21).map((piece) => piece.body);
    const at22 = eligibleAt(corpus, 22).map((piece) => piece.body);
    const at23 = eligibleAt(corpus, 23).map((piece) => piece.body);

    expect(at21).toContain(AGE_21_ONLY);
    expect(at21.length).toBeGreaterThan(1);
    expect(at20).not.toContain(AGE_21_ONLY);
    expect(at22).not.toContain(AGE_21_ONLY);
    expect(at23).not.toContain(AGE_21_ONLY);
  });

  it("includes the 22-only piece with other age-22 advice, not neighbouring ages", () => {
    const corpus = loadCorpus();
    const at20 = eligibleAt(corpus, 20).map((piece) => piece.body);
    const at21 = eligibleAt(corpus, 21).map((piece) => piece.body);
    const at22 = eligibleAt(corpus, 22).map((piece) => piece.body);
    const at23 = eligibleAt(corpus, 23).map((piece) => piece.body);

    expect(at22).toContain(AGE_22_ONLY);
    expect(at22.length).toBeGreaterThan(1);
    expect(at20).not.toContain(AGE_22_ONLY);
    expect(at21).not.toContain(AGE_22_ONLY);
    expect(at23).not.toContain(AGE_22_ONLY);
  });
});
