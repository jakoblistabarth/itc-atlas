import { TimelineEvent } from "./TimelineEvent";

export type Link = {
  code: string;
  description: string;
};

export type Fork = {
  year: string;
  in: string;
  out: string;
};

export type CourseGenealogyItem = {
  source: string;
  target: string;
  start: Date;
  end: Date;
  type: "start" | "end" | "link";
};

export type CourseGenealogy = {
  nodes: TimelineEvent[];
  links: CourseGenealogyItem[];
};
