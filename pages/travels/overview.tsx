import { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import BackToHome from "../../components/backToHome";
import SummaryTable from "../../components/summaryTable";
import getFlights from "../../lib/getFlights";
import getTestData from "../../lib/getTestData";
import { FlightsTable } from "../../types/Table";
import styles from "../../styles/home.module.css";

type OverviewProps = {
  flights: FlightsTable;
  test: Awaited<ReturnType<typeof getTestData>>;
};

const Overview: NextPage<OverviewProps> = ({ flights, test }) => {
  return (
    <>
      <Head>
        <title>Flight Overview</title>
      </Head>

      <main className={styles.main}>
        <h1>Flight Overview</h1>
        <SummaryTable table={flights} />
        <p>
          <Link href="/">
            <BackToHome />
          </Link>
        </p>
      </main>
    </>
  );
};

export default Overview;
