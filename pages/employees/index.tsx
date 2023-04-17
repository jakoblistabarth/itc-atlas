import type { NextPage } from "next";
import Head from "next/head";
import SummaryTable from "../../components/SummaryTable";
import Footer from "../../components/Footer";
import { Container, Grid, Heading, Text } from "theme-ui";
import CardLink from "../../components/CardLink";
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

      <Container>
        <main>
          <Heading as="h1">Staff</Heading>
          <Text variant="teaser">Insights into ITC&apos;s employees.</Text>

          <Grid variant="navigation">
            <CardLink href={`${route}/origin`}>
              <Heading as="h2">Origin</Heading>
            </CardLink>
          </Grid>

          {error && <div>failed to load</div>}
          {isLoading && <div>Loading …</div>}
          {!isLoading && !error && <SummaryTable data={aq.from(data)} />}
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default EmployeesPage;
