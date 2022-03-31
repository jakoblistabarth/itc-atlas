import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import SummaryTable from "../../components/summarytable";
import getFlights from "../../lib/getFlights";
import getTestData from "../../lib/getTestData";

export async function getStaticProps() {
  // const res = await getFlights();
  // const data = JSON.stringify(res.flights);
  const res = await getTestData();
  const data = JSON.stringify(res);
  return {
    props: {
      data,
    },
  };
}

export default function Overview({ data }) {
  return (
    <Layout>
      <Head>
        <title>Flight Overview</title>
      </Head>
      <h1>Flight Overview</h1>
      <p>This table gives an overview on the complete dataset.</p>
      <SummaryTable data={data} />
      <p>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </p>
    </Layout>
  );
}
