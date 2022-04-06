import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import BackToHome from "../../components/backToHome";
import SummaryTable from "../../components/summaryTable";
import getProjects from "../../lib/getProjects";
import { Project } from "../../types/Project";

export async function getStaticProps() {
  const projects = await getProjects();
  return {
    props: {
      projects,
    },
  };
}

type OverviewProps = React.PropsWithChildren<{
  projects: Project[];
}>;

const Overview: FC<OverviewProps> = ({ projects }) => {
  return (
    <>
      <Head>
        <title>Project Overview</title>
      </Head>
      <h1>Project Overview</h1>
      <p>
        <Link href="/">
          <BackToHome />
        </Link>
      </p>
      <SummaryTable table={projects} />
    </>
  );
};

export default Overview;
