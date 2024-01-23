export const chapters = [
  "Introduction",
  "Research",
  "Institutional strengthening",
  "Education",
  "Appendix",
] as const;

export type Chapter = (typeof chapters)[number];

export const isChapter = (maybeChapter: string): maybeChapter is Chapter =>
  !!chapters.find((d) => d === maybeChapter);
