import { FC } from "react";
import CardLink from "../CardLink";
import IconResearch from "../../public/images/icon_research.svg";
import IconEducation from "../../public/images/icon_education.svg";
import IconProjects from "../../public/images/icon_projects.svg";
import IconIntroduction from "../../public/images/icon_introduction.svg";
import IconAppendix from "../../public/images/icon_appendix.svg";
import Section from "../Section";

type Props = {
  title?: string;
};

const ChapterNavigation: FC<Props> = ({ title = "Chapters" }) => (
  <Section>
    <h2>{title}</h2>
    <div className="mb-4 mt-2 grid max-w-4xl grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-3">
      <CardLink href="/introduction">
        <IconIntroduction width={"2em"} height={"2em"} opacity={0.2} />
        <h3>Introduction</h3>
      </CardLink>
      <CardLink href="/research">
        <IconResearch width={"2em"} height={"2em"} opacity={0.2} />
        <h3>Chapter Research</h3>
      </CardLink>
      <CardLink disabled href="/education">
        <IconEducation width={"2em"} height={"2em"} opacity={0.2} />
        <h3>Chapter Education</h3>
      </CardLink>
      <CardLink href="/projects">
        <IconProjects width={"2em"} height={"2em"} opacity={0.2} />
        <h3>Chapter Projects</h3>
      </CardLink>
      <CardLink disabled href="/appendix">
        <IconAppendix width={"2em"} height={"2em"} opacity={0.2} />
        <h3>Appendix</h3>
      </CardLink>
    </div>
  </Section>
);

export default ChapterNavigation;
