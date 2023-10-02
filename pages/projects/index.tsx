import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { AgGridReact } from "ag-grid-react";
import * as aq from "arquero";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import useSWR from "swr";
import { Container, Grid, Heading, Paragraph } from "theme-ui";
import CardLink from "../../components/CardLink";
import ChapterHeader from "../../components/ChapterHeader";
import Footer from "../../components/Footer";
import Seo from "../../components/Seo";
import SummaryTable from "../../components/SummaryTable";
import ChapterHighlights from "../../components/ChapterHighlights";

const Projects: NextPage = () => {
  const { data, error, isLoading } = useSWR("/api/data/project/");
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
      href: `${route}/project-explorer-3d`,
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
      <ChapterHeader chapterName="ITC's projects" />

      <Container>
        <main>
          <Heading as="h2">Chapter Projects</Heading>
          <Paragraph variant="teaser">
            Insights into ITC&apos;s projects around the globe.
          </Paragraph>
          <Paragraph>
            The last decade the thematic focus was more consistent, but the
            geographic focus continues to shift, reflecting political choices.
            Development cooperation is seen as bilateral cooperation among
            stakeholders. From the Dutch side the national government works with
            societal partners such as ngo’s, knowledge institutions, and the
            private sector.
          </Paragraph>

          <ChapterHighlights
            highlights={[
              {
                href: "projects/project-explorer-3d",
                title: "The globe of projects",
              },
              {
                href: "projects/projects-spacetimecube",
                title: "Projects over time",
              },
            ]}
          />

          <Grid variant={"navigation"}>
            {links.map((l, idx) => (
              <CardLink key={idx} href={l.href}>
                <Heading as="h2">{l.children}</Heading>
              </CardLink>
            ))}
          </Grid>

          {error && <div>failed to load</div>}
          {isLoading && <div>Loading …</div>}
          {!isLoading && !error && (
            <>
              <SummaryTable data={aq.from(data)} />
              <div className="ag-theme-material" style={{ height: 500 }}>
                <AgGridReact
                  rowData={data}
                  columnDefs={columnDefs}
                  defaultColDef={defaultColDef}
                  pagination={true}
                />
              </div>
            </>
          )}
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Projects;
