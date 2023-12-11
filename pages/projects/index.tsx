import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";
import * as aq from "arquero";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWRImmutable from "swr/immutable";
import CardLink from "../../components/CardLink";
import ChapterHeader from "../../components/ChapterHeader";
import Footer from "../../components/Footer";
import Seo from "../../components/Seo";
import SummaryTable from "../../components/SummaryTable";
import ChapterHighlights from "../../components/ChapterHighlights";
import Container from "../../components/Container";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";
import Paragraph from "../../components/Paragraph";
import SecondaryNavigation from "../../components/SecondaryNavigation";

const Projects: NextPage = () => {
  const { data, error, isLoading } = useSWRImmutable("/api/data/project/");
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
      href: `${route}/projectsafrica`,
      children: "Sub-Saharan Africa",
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

  const columnDefs: ColDef[] = [
    { field: "id" },
    { field: "name" },
    { field: "nameShort" },
    { field: "description" },
    { field: "type" },
    { field: "status" },
    { field: "start", filter: "agDateColumnFilter" },
    { field: "end", filter: "agDateColumnFilter" },
  ];

  const defaultColDef = {
    filter: true,
    sortable: true,
  };
  return (
    <>
      <Seo title="ITC's projects" />
      <ChapterHeader chapterName="Projects" />

      <Container>
        <main>
          <Section>
            <h2>Chapter Projects</h2>
            <Teaser>Insights into ITC&apos;s projects around the globe.</Teaser>
            <Paragraph>
              The last decade the thematic focus was more consistent, but the
              geographic focus continues to shift, reflecting political choices.
              Development cooperation is seen as bilateral cooperation among
              stakeholders. From the Dutch side the national government works
              with societal partners such as NGO&apos;s, knowledge institutions,
              and the private sector.
            </Paragraph>
          </Section>

          <Section>
            <ChapterHighlights
              highlights={[
                {
                  href: "projects/globe",
                  title: "The globe of projects",
                },
                {
                  href: "projects/projects-spacetimecube",
                  title: "Projects over time",
                },
              ]}
            />
          </Section>

          <Section>
            <SecondaryNavigation>
              {links.map((l, idx) => (
                <CardLink key={idx} href={l.href}>
                  <h2>{l.children}</h2>
                </CardLink>
              ))}
            </SecondaryNavigation>
          </Section>

          {error && <div>failed to load</div>}
          {isLoading && <div>Loading …</div>}
          {!isLoading && !error && (
            <Section>
              <SummaryTable data={aq.from(data)} />
              <div className="ag-theme-material mt-5 h-[500px]">
                <AgGridReact
                  rowData={data}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                />
              </div>
            </Section>
          )}
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Projects;
