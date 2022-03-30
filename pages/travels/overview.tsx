import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/layout";
import SummaryTable from "../../components/summarytable";
import getFlights from "../../lib/getFlights";

export async function getStaticProps() {
  const res = await getFlights();
  const data = JSON.stringify(res.flights);
  // const example = [
  //   { name: "John", height: 130, dateOfBirth: null, favNo: 2 },
  //   { name: "John", height: 170, dateOfBirth: "1990-03-10", favNo: 12 },
  //   { name: "Ana", height: 160, dateOfBirth: "1990-03-15", favNo: null },
  //   { name: "Jonas", height: 150, dateOfBirth: "1992-02-12", favNo: null },
  //   { name: "Amely", height: null, dateOfBirth: "1993-10-10", favNo: 2 },
  // ];
  // const data = JSON.stringify(example);
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
      <p>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </p>
      <SummaryTable data={data} />
    </Layout>
  );
}
