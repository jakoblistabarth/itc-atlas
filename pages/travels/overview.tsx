import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import BackToHome from "../../components/backToHome";
import Layout from "../../components/layout";
import SnapshotWrapper from "../../components/snapshotWrapper";
import SummaryTable from "../../components/summaryTable";
import getFlights from "../../lib/getFlights";
import getTestData from "../../lib/getTestData";
import { ColumnType } from "../../types/Column";
import { FlightsTable } from "../../types/Table";

type OverviewProps = {
  flights: FlightsTable;
  test: Awaited<ReturnType<typeof getTestData>>;
};

const Overview: NextPage<OverviewProps> = ({ flights, test }) => {
  return (
    <Layout>
      <Head>
        <title>Flight Overview</title>
      </Head>
      <h1>Flight Overview</h1>
      <SummaryTable table={flights} />
      <p>
        <Link href="/">
          <BackToHome />
        </Link>
      </p>
    </Layout>
  );
};

export default Overview;

export const getStaticProps: GetStaticProps<OverviewProps> = async () => {
  const flights = await getFlights();
  const test = await getTestData();
  return {
    props: {
      flights: flights.flights,
      test,
    },
  };
};
