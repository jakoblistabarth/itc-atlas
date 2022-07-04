import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/home.module.css";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import Link from "next/link";
import BackToHome from "../../components/BackToHome";
import getFlights from "../../lib/data/getFlights";
import SummaryTable from "../../components/SummaryTable";
import Footer from "../../components/Footer";
import DataFrame from "../../lib/DataFrame/DataFrame";
import Heading, { Headings } from "../../components/Heading";
import { Row } from "../../types/DataFrame";

type Props = {
  flights: Row[];
};

const Travels: NextPage<Props> = ({ flights }) => {
  const flightsDf = new DataFrame(flights);
  return (
    <>
      <Head>
        <title>ITC's world</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Travels</Heading>

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

          <Link href="/travels/flights3D">
            <a className={styles.card}>
              <h2>
                Flights (Globe) <MdOutlineArrowRightAlt />
              </h2>
            </a>
          </Link>
        </div>
        <SummaryTable data={flightsDf} />
        <p>
          <BackToHome />
        </p>
      </main>

      <Footer />
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
