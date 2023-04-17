import type { NextPage } from "next";
import Head from "next/head";
import SummaryTable from "../../components/SummaryTable";
import Footer from "../../components/Footer";
import { Container, Heading, Text } from "theme-ui";
import * as aq from "arquero";
import useSWR from "swr";

const Btors: NextPage = () => {
  const { data, error, isLoading } = useSWR("/api/data/btor/");

  return (
    <>
      <Head>
        <title>ITC&apos;s world</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <Heading as="h1">Btors</Heading>

          <Text variant="teaser">
            Insights into ITC&apos;s travels around the globe through the
            &quot;Back to Office&quot; Reports.
          </Text>

          {error && <div>failed to load</div>}
          {isLoading && <div>Loading …</div>}
          {!isLoading && !error && <SummaryTable data={aq.from(data)} />}
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Btors;
