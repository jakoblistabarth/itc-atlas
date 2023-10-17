import type { NextPage } from "next";
import CardLink from "../../components/CardLink";
import PageBase from "../../components/PageBase/PageBase";
import Container from "../../components/Container";
import Teaser from "../../components/Teaser";
import SecondaryNavigation from "../../components/SecondaryNavigation";

const Page: NextPage = () => (
  <PageBase title="BTORS">
    <Container>
      <main>
        <Teaser>
          Insights into ITC&apos;s travels around the globe through the
          &quot;Back to Office&quot; reports.
        </Teaser>

        <SecondaryNavigation>
          <CardLink href={`/btors/travels-by-department`}>
            <h2>By department</h2>
          </CardLink>
        </SecondaryNavigation>
      </main>
    </Container>
  </PageBase>
);

export default Page;
