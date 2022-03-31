import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import SummaryTable from "../../components/summaryTable";
import getProjects from "../../lib/getProjects";
import Project from "../../pages/api/data/projects"; //TODO: How to use type here

export async function getStaticProps() {
  const data = await getProjects();
  const projects = JSON.stringify(data);
  return {
    props: {
      projects,
    },
  };
}

export default function Overview({ projects }) {
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
      <SummaryTable data={projects} />
    </Layout>
  );
}
