import * as d3 from "d3";

type StackItem = {
  value: number | string | Date | [];
  count: number;
  start: number;
  end: number;
};

type Stack = StackItem[];

export const cropStack = (stack: Stack, maxCategories = 100) => {
  if (stack.length < maxCategories) return stack;
  const modifiedStack = stack.slice(0, maxCategories);
  modifiedStack.push({
    value: "Other categories",
    start: stack[maxCategories - 1].end,
    end: 1,
    count: stack
      .slice(maxCategories)
      .reduce((sum: number, d) => (sum += d.count), 0),
  });
  return modifiedStack;
};

export const createStack = (column: []) => {
  const ColumnNoNA = column.filter(
    (d) => d !== undefined && d !== null && d !== "" && d != "null"
  );
  const total = ColumnNoNA.length;

  const frequencies = d3.rollup(
    ColumnNoNA,
    (v) => v.length,
    (d) => d
  );

  let count = 0;
  const preStack: Stack = Array.from(frequencies)
    .sort((a, b) => b[1] - a[1])
    .map((d) => ({
      value: d[0],
      count: d[1] / total,
      start: count / total,
      end: (count += d[1]) / total,
    }))
    .sort((a, b) => a.start - b.start);

  return cropStack(preStack);
};
