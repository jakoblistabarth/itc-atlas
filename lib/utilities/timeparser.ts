export function ddmmyyyyToDate(str: string) {
  const [d, m, y] = str.split("-");
  return new Date(parseInt(d, 10), parseInt(m, 10) - 1, parseInt(y, 10));
}
