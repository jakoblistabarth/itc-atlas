import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/home.module.css";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import Link from "next/link";
import BackToHome from "../../components/backToHome";
import { FlightsTable } from "../../types/Table";
import getFlights from "../../lib/getFlights";
import SummaryTable from "../../components/summaryTable";

type Props = {
  flights: FlightsTable;
};

const Travels: NextPage<Props> = ({ flights }) => {
  return (
    <>
      <Head>
        <title>ITC's world</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Travels</h1>

        <p className={styles.description}>
          Insights into ITC's travels around the globe.
        </p>

        <div className={styles.grid}>
          <Link href="/travels/airports">
            <a className={styles.card}>
              <h2>
                Airports <MdOutlineArrowRightAlt />
              </h2>
            </a>
          </Link>

          <Link href="/travels/flights">
            <a className={styles.card}>
              <h2>
                Flights <MdOutlineArrowRightAlt />
              </h2>
            </a>
          </Link>
        </div>
        <SummaryTable table={flights} />
        <p>
          <Link href="/">
            <BackToHome />
          </Link>
        </p>
      </main>

      <footer className={styles.footer}>March 2022</footer>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const flights = await getFlights();
  return {
    props: {
      flights: flights.flights,
    },
  };
};

export default Travels;
