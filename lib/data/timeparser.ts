export function ddmmyyyyToDate(str: string) {
  const splits = str.split("-");
  return new Date(
    parseInt(splits[2], 10),
    parseInt(splits[1], 10) - 1,
    parseInt(splits[0], 10)
  );
}
