import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import BackToHome from "../../components/BackToHome";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import SummaryTable from "../../components/SummaryTable";
import DataFrame from "../../lib/DataFrame/DataFrame";
import getApplicants from "../../lib/data/getApplicants";
import styles from "../../styles/home.module.css";
import { Applicant } from "../../types/Applicant";

type Props = {
  applicants: Applicant[];
};

const ApplicantsOverview: NextPage<Props> = ({ applicants }) => {
  const applicantsDf = new DataFrame(applicants);
  return (
    <>
      <Head>
        <title>ITC's applicants</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>ITC's applicants</Heading>

        <p className={styles.description}>Insights into ITC's applicants.</p>

        <p>
          <BackToHome />
        </p>
        <SummaryTable data={applicantsDf} />
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const applicants = await getApplicants();
  return {
    props: {
      applicants,
    },
  };
};

export default ApplicantsOverview;
