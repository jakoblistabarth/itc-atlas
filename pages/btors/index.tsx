import type { NextPage } from "next";
import { Container, Grid, Heading, Text } from "theme-ui";
import CardLink from "../../components/CardLink";
import PageBase from "../../components/PageBase/PageBase";

const Page: NextPage = () => (
  <PageBase title="BTORS">
    <Container>
      <main>
        <Text variant="teaser">
          Insights into ITC&apos;s travels around the globe through the
          &quot;Back to Office&quot; reports.
        </Text>

        <Grid variant="navigation">
          <CardLink href={`/btors/travels-by-department`}>
            <Heading as="h2">By department</Heading>
          </CardLink>
        </Grid>
      </main>
    </Container>
  </PageBase>
);

export default Page;
