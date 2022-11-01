import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/home.module.css";
import getFlights2019 from "../../lib/data/getFlights2019";
import SummaryTable from "../../components/SummaryTable";
import Footer from "../../components/Footer";
import DataFrame from "../../lib/DataFrame/DataFrame";
import Heading, { Headings } from "../../components/Heading";
import { Row } from "../../lib/DataFrame/DataFrame";
import LinkFramed from "../../components/LinkFramed";
import { nanoid } from "nanoid";

type Props = {
  flights: Row[];
};

const Travels: NextPage<Props> = ({ flights }) => {
  const links = [
    {
      href: "/flights2019/airports",
      children: "Airports",
    },
    {
      href: "/flights2019/flights",
      children: "Flights (map)",
    },
    {
      href: "/flights2019/flights3D",
      children: "Flights (globe)",
    },
  ];
  const flightsDf = new DataFrame(flights);
  return (
    <>
      <Head>
        <title>ITC's world</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Flights 2019</Heading>

        <p className={styles.description}>
          Insights into ITC's travels in 2019.
        </p>

        <div className={styles.grid}>
          {links.map((l) => (
            <LinkFramed key={nanoid()} href={l.href}>
              {l.children}
            </LinkFramed>
          ))}
        </div>
        <SummaryTable data={flightsDf} />
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const flights = await getFlights2019();
  return {
    props: {
      flights: flights.flights,
    },
  };
};

export default Travels;
