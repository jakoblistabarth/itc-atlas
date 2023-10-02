/** @jsxImportSource theme-ui */

import { FC } from "react";
import { Heading, Grid, Box } from "theme-ui";
import CardLink from "../CardLink";
import IconResearch from "../../public/images/icon_research.svg";
import IconEducation from "../../public/images/icon_education.svg";
import IconProjects from "../../public/images/icon_projects.svg";
import IconIntroduction from "../../public/images/icon_introduction.svg";
import IconAppendix from "../../public/images/icon_appendix.svg";

type Props = {
  title?: string;
};

const ChapterNavigation: FC<Props> = ({ title = "Chapters" }) => (
  <Box as="section" variant="layout.section">
    <Heading as="h2">{title}</Heading>
    <Grid variant="navigation">
      <CardLink href="/introduction">
        <IconIntroduction width={"2em"} height={"2em"} opacity={0.2} />
        <Heading as="h3">Introduction</Heading>
      </CardLink>
      <CardLink disabled={true} href="/research">
        <IconResearch width={"2em"} height={"2em"} opacity={0.2} />
        <Heading as="h3">Chapter Research</Heading>
      </CardLink>
      <CardLink disabled={true} href="/education">
        <IconEducation width={"2em"} height={"2em"} opacity={0.2} />
        <Heading as="h3">Chapter Education</Heading>
      </CardLink>
      <CardLink href="/projects">
        <IconProjects width={"2em"} height={"2em"} opacity={0.2} />
        <Heading as="h3">Chapter Projects</Heading>
      </CardLink>
      <CardLink disabled={true} href="/appendix">
        <IconAppendix width={"2em"} height={"2em"} opacity={0.2} />
        <Heading as="h3">Appendix</Heading>
      </CardLink>
    </Grid>
  </Box>
);

export default ChapterNavigation;
