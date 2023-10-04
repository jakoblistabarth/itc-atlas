import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Container, Grid, Heading, Text } from "theme-ui";
import CardLink from "../../components/CardLink";
import PageBase from "../../components/PageBase";

const Page: NextPage = () => {
  const { route } = useRouter();

  return (
    <PageBase title="ITC's PhDs">
      <Container>
        <main>
          <Text variant="teaser">Insights into ITC&apos;s PhDs.</Text>

          <Grid variant="navigation">
            <CardLink href={`${route}/departments`}>
              <Heading as="h2">Per country of origin and department</Heading>
            </CardLink>
            <CardLink href={`${route}/theses`}>
              <Heading as="h2">Overview of ITC&apos;s theses</Heading>
            </CardLink>
          </Grid>
        </main>
      </Container>
    </PageBase>
  );
};

export default Page;
