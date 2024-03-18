export const chapters = [
  "Introduction",
  "Education",
  "Research",
  "Institutional strengthening",
  "Appendix",
] as const;

export type Chapter = (typeof chapters)[number];

export const isChapter = (maybeChapter: string): maybeChapter is Chapter =>
  !!chapters.find((d) => d === maybeChapter);
