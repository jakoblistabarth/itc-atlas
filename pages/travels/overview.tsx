import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import { GetServerSideProps } from "next";
import Layout from "../../components/layout";
import Snapshot from "../../components/snapshot";
import SummaryTable from "../../components/summaryTable";
import getFlights from "../../lib/getFlights";
import getTestData from "../../lib/getTestData";

type OverviewProps = {
  data: unknown[];
  test: Awaited<ReturnType<typeof getTestData>>;
};

const Overview: FC<OverviewProps> = ({ data, test }) => (
  <Layout>
    <Head>
      <title>Flight Overview</title>
    </Head>
    <h1>Flight Overview</h1>
    <p>🤫 for debugging only</p>
    <Snapshot data={test.map((d) => d.name)} />
    <Snapshot data={test.map((d) => d.favNo)} />
    <Snapshot data={test.map((d) => d.dateOfBirth)} />
    <SummaryTable data={test} />
    <p>This table gives an overview on the complete dataset.</p>
    <SummaryTable data={data} />
    <p>
      <Link href="/">
        <a>Back to home</a>
      </Link>
    </p>
  </Layout>
);

export default Overview;

export const getServerSideProps: GetServerSideProps<
  OverviewProps
> = async () => {
  const { flights: data } = await getFlights();
  const test = await getTestData();
  return {
    props: {
      data,
      test,
    },
  };
};
