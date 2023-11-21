import loadPhds from "../load/loadPhds";
import * as aq from "arquero";
import { describe, test, expect, beforeAll } from "@jest/globals";
import { PhdClean } from "../../../types/PhdClean";

let phds: Awaited<ReturnType<typeof loadPhds>>;

beforeAll(async () => {
  phds = await loadPhds();
});

describe("For Phds", () => {
  test("itcStudentIds do not occure more than once", () => {
    const duplicates = aq
      .from(phds)
      .filter((d: PhdClean) => d.itcStudentId)
      .groupby("itcStudentId")
      .count()
      .filter((d: { itcStudentId: string; count: number }) => d.count > 1)
      .numRows();
    expect(duplicates).toBe(0);
  });

  describe("All Phds' DOIs", () => {
    test("do not end on /", () => {
      const rows = aq
        .from(phds)
        .filter((d: PhdClean) => aq.op.match(d.doi, /\\$/, undefined));
      expect(rows.numRows()).toBe(0);
    });
  });
});
