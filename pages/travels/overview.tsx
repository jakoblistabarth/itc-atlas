import { GetServerSideProps } from "next";
import Head from "next/head";
import Link from "next/link";
import { FC } from "react";
import Layout from "../../components/layout";
import styles from "../../styles/layout.module.css";
import Snapshot from "../../components/snapshot";
import SummaryTable from "../../components/summaryTable";
import getFlights from "../../lib/getFlights";
import getTestData from "../../lib/getTestData";
import { ColumnType } from "../../types/Column";
import { Table } from "../../types/Table";

type OverviewProps = {
  flights: Table;
  test: Awaited<ReturnType<typeof getTestData>>;
};

const Overview: FC<OverviewProps> = ({ flights, test }) => {
  return (
    <Layout>
      <Head>
        <title>Flight Overview</title>
      </Head>
      <h1>Flight Overview</h1>
      <p>🤫 for debugging only</p>
      <Snapshot
        column={test.map((d) => d.name)}
        columnName="name"
        type={ColumnType.Ordinal}
      />
      <Snapshot
        column={test.map((d) => d.favNo)}
        columnName="favNo"
        type={ColumnType.Contiuous}
        detailed={true}
      />
      <Snapshot
        column={test.map((d) => d.dateOfBirth)}
        columnName="dateofBirth"
        type={ColumnType.Date}
      />
      <SummaryTable table={test} />
      <p>This table gives an overview on the complete dataset.</p>
      <SummaryTable table={flights} />
      <p>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </p>
    </Layout>
  );
};

export default Overview;

export const getServerSideProps: GetServerSideProps<
  OverviewProps
> = async () => {
  const flights = await getFlights();
  const test = await getTestData();
  return {
    props: {
      flights: flights.flights,
      test,
    },
  };
};
