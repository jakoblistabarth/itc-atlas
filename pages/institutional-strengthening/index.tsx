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
import { range } from "d3";

const Projects: NextPage = () => {
  const { route } = useRouter();
  return (
    <PageChapter chapterName="Institutional strengthening">
      <Section>
        <h1>Chapter Institutional Strengthening</h1>
        <Teaser>Applying our knowlegde in the real world</Teaser>
        <Paragraph>
          Through professional engagement with partners in the focus countries,
          often via educational and/or research cooperation, ITC can support the
          functioning of those parties, and at the same time incorporate
          experiences gained in its knowledge base to be reapplied at a later
          stage.
        </Paragraph>
        <Paragraph>
          This section starts with the activities of ITC in Indonesia to
          demonstrate how over time the external technological, societal and
          political context has influenced how ITC and its Indonesian partners
          have worked together. This is followed by a global spatial and
          temporal overview of all ITC projects executed since the 1990s.
        </Paragraph>
      </Section>

      <Section>
        <ChapterContents
          highlights={[
            {
              href: `${route}/indonesia`,
              title:
                "Impact of policy changes on ITC’s efforts in capacity building",
            },
            {
              href: `${route}/projects-by-country`,
              title: "Projects by country",
            },
            {
              href: `${route}/projects-over-time`,
              title: "Projects over time",
            },
          ]}
        />
      </Section>

      <Section>
        <h2>More on Institutional strengthening</h2>
        <Paragraph>
          The highlight of the section are ten detailed projects description
          which show the impact of ITC institutional strengthening activities.
        </Paragraph>
        <SecondaryNavigation>
          {[
            { title: "Naivasha Region", url: "naivasha" },
            { title: "Africa", url: "projectsafrica" },
          ].map((d, idx) => (
            <CardLink key={`project-${idx}`} href={`${route}/${d.url}`}>
              <h3>{d.title}</h3>
            </CardLink>
          ))}
        </SecondaryNavigation>
      </Section>
    </PageChapter>
  );
};

export default Projects;
