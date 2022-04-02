import Head from "next/head";
import Link from "next/link";
import PropTypes from "prop-types";
import { FC, PropsWithChildren } from "react";
import Layout from "../../components/layout";
import SummaryTable from "../../components/summaryTable";
import { server } from "../../config";
import { Project } from "../../types/Project"; //TODO: How to use type here

export async function getStaticProps() {
  const res = await fetch(`${server}/api/data/projects`);
  const projects = await res.json();
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

Overview.propTypes = {
  projects: PropTypes.array.isRequired,
};

export default Overview;
