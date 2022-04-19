import type { NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/home.module.css";
import BackToHome from "../../components/backToHome";
import SummaryTable from "../../components/summaryTable";
import Footer from "../../components/footer";
import getStaff from "../../lib/data/getStaff";
import Heading, { Headings } from "../../components/heading";
import { Staff } from "../../types/Staff";
import DataFrame from "../../lib/DataFrame/DataFrame";

type Props = React.PropsWithChildren<{
  staff: Staff[];
}>;

const Staff: NextPage<Props> = ({ staff }) => {
  const staffDf = new DataFrame(staff);
  return (
    <>
      <Head>
        <title>ITC's staff</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>Staff</Heading>
        <p className={styles.description}>Insights into ITC's staff members.</p>
        <p>
          <BackToHome />
        </p>

        <SummaryTable data={staffDf} />
      </main>

      <Footer />
    </>
  );
};

export async function getStaticProps() {
  const staff = await getStaff();
  return {
    props: {
      staff,
    },
  };
}

export default Staff;
