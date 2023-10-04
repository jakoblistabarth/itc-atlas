import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Container, Grid, Heading, Text } from "theme-ui";
import CardLink from "../../components/CardLink";
import PageBase from "../../components/PageBase";

const Page: NextPage = () => {
  const { route } = useRouter();

  return (
    <PageBase title="ITC's applicants">
      <Container>
        <main>
          <Text variant="teaser">Insights into ITC&apos;s applicants.</Text>

          <Grid variant="navigation">
            <CardLink href={`${route}/origin-country`}>
              <Heading as="h2">Alumni by country</Heading>
            </CardLink>
          </Grid>
        </main>
      </Container>
    </PageBase>
  );
};

export default Page;
