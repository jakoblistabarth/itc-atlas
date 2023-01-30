import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/home.module.css";
import BackToHome from "../../components/BackToHome";
import { Project } from "../../types/Project";
import getProjects from "../../lib/data/getProjects";
import Footer from "../../components/Footer";
import DataFrame from "../../lib/DataFrame/DataFrame";
import Heading, { Headings } from "../../components/Heading";
import LinkFramed from "../../components/LinkFramed";
import { nanoid } from "nanoid";

import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-material.css";
import { ColDef } from "ag-grid-community";

type Props = React.PropsWithChildren<{
  projects: Project[];
}>;

const Travels: NextPage<Props> = ({ projects }) => {
  const links = [
    {
      href: "/projects/projects-timeline",
      children: "Timline",
    },
    {
      href: "/projects/projectcountries",
      children: "Projects by Country",
    },
    {
      href: "/projects/projectsafrica",
      children: "Sub-Saharan Africa",
    },
    {
      href: "/projects/naivasha",
      children: "Naivasha Region",
    },
    {
      href: "/projects/projects-spacetimecube",
      children: "Projects Space Time Cube",
    },
    {
      href: "/projects/indonesia",
      children: "Indonesia",
    },
  ];
  const projectsDf = new DataFrame(projects);
  const duplicates = projectsDf.findDuplicates("projectShortName");
  const sum = duplicates.reduce((acc, [key, rows]) => {
    acc += rows.length;
    return acc;
  }, 0);
  console.log(duplicates, sum);

  const columnDefs: ColDef[] = [
    { field: "projectID" },
    { field: "projectName" },
    { field: "allCountries" },
    { field: "populatedPlaceNe" },
    { field: "type" },
    { field: "dateStart", filter: "agDateColumnFilter" },
    { field: "dateEnd", filter: "agDateColumnFilter" },
  ];

  const defaultColDef = {
    filter: true,
    sortable: true,
  };
  return (
    <>
      <Head>
        <title>ITC's projects</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Projects</Heading>

        <p className={styles.description}>
          Insights into ITC's projects around the globe.
        </p>

        <div className={styles.grid}>
          {links.map((l) => (
            <LinkFramed key={nanoid()} href={l.href}>
              {l.children}
            </LinkFramed>
          ))}
        </div>
        <p>
          <BackToHome />
        </p>

        {/* <SummaryTable data={projectsDf} /> */}
        <div className="ag-theme-material" style={{ width: 1280, height: 500 }}>
          <AgGridReact
            rowData={projects}
            columnDefs={columnDefs}
            defaultColDef={defaultColDef}
            pagination={true}
          />
        </div>
      </main>

      <Footer />
    </>
  );
};

export async function getStaticProps() {
  const projects = await getProjects();
  return {
    props: {
      projects,
    },
  };
}

export default Travels;
