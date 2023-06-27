import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import { Container, Heading, Grid, Text } from "theme-ui";
import { useRouter } from "next/router";
import CardLink from "../../components/CardLink";

const Page: NextPage = () => {
  const { route } = useRouter();

  return (
    <>
      <Head>
        <title>ITC&apos;s applicants</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <Heading as="h1">ITC&apos;s applicants</Heading>
          <Text variant="teaser">Insights into ITC&apos;s applicants.</Text>

          <Grid variant="navigation">
            <CardLink href={`${route}/origin-country`}>
              <Heading as="h2">Alumni by country</Heading>
            </CardLink>
          </Grid>
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Page;
