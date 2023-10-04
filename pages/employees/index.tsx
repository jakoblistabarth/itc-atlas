import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Container, Grid, Heading, Text } from "theme-ui";
import CardLink from "../../components/CardLink";
import PageBase from "../../components/PageBase";

const Page: NextPage = () => {
  const { route } = useRouter();

  return (
    <PageBase title="Employees">
      <Container>
        <main>
          <Text variant="teaser">Insights into ITC&apos;s employees.</Text>

          <Grid variant="navigation">
            <CardLink href={`${route}/origin`}>
              <Heading as="h2">Origin</Heading>
            </CardLink>
          </Grid>
        </main>
      </Container>
    </PageBase>
  );
};

export default Page;
