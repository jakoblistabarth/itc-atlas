import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import CardLink from "../../components/CardLink";
import ChapterContents from "../../components/ChapterContents";
import PageChapter from "../../components/PageChapter";
import Paragraph from "../../components/Paragraph";
import SecondaryNavigation from "../../components/SecondaryNavigation";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";

const Projects: NextPage = () => {
  const { route } = useRouter();
  const links = [
    {
      href: `${route}/projects-timeline`,
      children: "Timeline",
    },
    {
      href: `${route}/projectcountries`,
      children: "Projects by Country",
    },
    {
      href: `${route}/naivasha`,
      children: "Naivasha Region",
    },
    {
      href: `${route}/globe`,
      children: "Projects Globe",
    },
    {
      href: `${route}/projects-spacetimecube`,
      children: "Projects Space Time Cube",
    },
  ];

  return (
    <PageChapter chapterName="Institutional strengthening">
      <Section>
        <h1>Chapter Institutional Strengthening</h1>
        <Teaser>Applying our knowlegde in the real world</Teaser>
        <Paragraph>
          Th rough professional engagement with partners in the focus countries,
          often via educational and/or research cooperation, ITC can support the
          functioning of those parties, and at the same time incorporate
          experiences gained in its knowledge base to be reapplied at a later
          stage.
        </Paragraph>
      </Section>

      <Section>
        <ChapterContents
          highlights={[
            {
              href: "introduction/indonesia",
              title: "ITC's impact in Indonesia",
            },
            {
              href: "institutional-strengthening/globe",
              title: "The globe of projects",
            },
            {
              href: "institutional-strengthening/projects-spacetimecube",
              title: "Projects over time",
            },
          ]}
        />
      </Section>

      <Section>
        <h2>More on Institutional strengthening</h2>
        <Paragraph>
          The last decade the thematic focus was more consistent, but the
          geographic focus continues to shift, reflecting political choices.
          Development cooperation is seen as bilateral cooperation among
          stakeholders. From the Dutch side the national government works with
          societal partners such as NGO&apos;s, knowledge institutions, and the
          private sector.
        </Paragraph>
        <SecondaryNavigation>
          {links.map((l, idx) => (
            <CardLink key={idx} href={l.href}>
              <h3>{l.children}</h3>
            </CardLink>
          ))}
        </SecondaryNavigation>
      </Section>
    </PageChapter>
  );
};

export default Projects;
