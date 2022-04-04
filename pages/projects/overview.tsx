import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import Layout from "../../components/layout";
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
    <Layout>
      <Head>
        <title>Project Overview</title>
      </Head>
      <h1>Project Overview</h1>
      <p>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </p>
      <SummaryTable table={projects} />
    </Layout>
  );
};

export default Overview;
