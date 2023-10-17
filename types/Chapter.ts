export const chapters = [
  "Introduction",
  "Research",
  "Projects",
  "Education",
  "Appendix",
] as const;

export type Chapters = (typeof chapters)[number];

export const isChapter = (maybeChapter: string): maybeChapter is Chapters =>
  !!chapters.find((d) => d === maybeChapter);
