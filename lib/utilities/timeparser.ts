export function ddmmyyyyToDate(str: string) {
  const [d, m, y] = str.split("-");
  return new Date(parseInt(y, 10), parseInt(m, 10) - 1, parseInt(d, 10));
}
