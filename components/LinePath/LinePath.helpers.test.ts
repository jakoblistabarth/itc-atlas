import { describe, test, expect } from "@jest/globals";
import { getFilledSeries } from "./LinePath.helpers";

const case1 = [
  { x: 2000, y: 1 },
  { x: 2002, y: 3 },
  { x: 2005, y: 6 },
];

const case2 = [
  { year: 2000, count: 1 },
  { year: 2002, count: 3 },
  { year: 2005, count: 6 },
];

describe("getFilledSeries", () => {
  test("creates a Datum containing x, y values", () => {
    const filled = getFilledSeries(case1);
    expect(filled[0]).toHaveProperty("x");
    expect(filled[0]).toHaveProperty("y");
  });
  test("creates a series of indicated length", () => {
    const filled = getFilledSeries(
      case2,
      (d) => d.year,
      (d) => d.count,
      2000,
      2006
    );
    expect(filled.length).toBe(6);
  });
});
