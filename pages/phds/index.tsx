import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import BackToHome from "../../components/BackToHome";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import SummaryTable from "../../components/SummaryTable";
import DataFrame from "../../lib/DataFrame/DataFrame";
import styles from "../../styles/home.module.css";
import LinkFramed from "../../components/LinkFramed";
import { PhdCandidate, PrismaClient } from "@prisma/client";

type Props = {
  phdCandidates: PhdCandidate[];
};

const PhdOverview: NextPage<Props> = ({ phdCandidates }) => {
  const phdCandidatesDf = new DataFrame(phdCandidates);
  return (
    <>
      <Head>
        <title>ITC's PhD candidates</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>ITC's PhD candidates</Heading>

        <p className={styles.description}>
          Insights into ITC's PhD candidates.
        </p>

        <div className={styles.grid}>
          <LinkFramed href="/phds/departments">
            Origin Per Country and Department
          </LinkFramed>
        </div>
        <SummaryTable data={phdCandidatesDf} />
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const prisma = new PrismaClient();
  const phdCandidates = await prisma.phdCandidate.findMany();
  return {
    props: {
      phdCandidates,
    },
  };
};

export default PhdOverview;
