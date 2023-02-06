import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/home.module.css";
import SummaryTable from "../../components/SummaryTable";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import LinkFramed from "../../components/LinkFramed";
import useSWR from "swr";
import { useRouter } from "next/router";
import * as aq from "arquero";

const EmployeesPage: NextPage = () => {
  const { route } = useRouter();
  const { data, error, isLoading } = useSWR("/api/data/employee/");

  return (
    <>
      <Head>
        <title>ITC&apos;s employees</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Staff</Heading>
        <p className={styles.description}>
          Insights into ITC&apos;s employees.
        </p>

        <div className={styles.grid}>
          <LinkFramed href={`${route}/origin`}>Origin</LinkFramed>
        </div>

        {error && <div>failed to load</div>}
        {isLoading && <div>Loading …</div>}
        {!isLoading && !error && <SummaryTable data={aq.from(data)} />}
      </main>

      <Footer />
    </>
  );
};

export default EmployeesPage;
