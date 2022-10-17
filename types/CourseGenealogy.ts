import { TimelineEvent } from "./TimelineEvent";

export type Node = {
  code: string;
  description: string;
};

export type Link = {
  start: string;
  end: string;
  in: string;
  out: string;
  stem: string;
};

export type CourseGenealogyItem = {
  source: string;
  target: string;
  start: Date;
  end: Date;
  stem: string;
};

export type CourseGenealogy = {
  nodes: TimelineEvent[];
  links: CourseGenealogyItem[];
};
