import loadPhds from "../load/loadPhds";
import * as aq from "arquero";
import { describe, test, expect, beforeAll } from "@jest/globals";

let phds: Awaited<ReturnType<typeof loadPhds>>;

beforeAll(async () => {
  phds = await loadPhds();
});

describe("For Phds", () => {
  //TODO: Fix or accept, as valid?
  test.failing("itcStudentIds do not occure more than once", () => {
    const duplicates = aq
      .from(phds)
      .filter((d: any) => d.itcStudentId)
      .groupby("itcStudentId")
      .count()
      .filter((d: any) => d.count > 1)
      .numRows();
    expect(duplicates).toBe(0);
  });
});
