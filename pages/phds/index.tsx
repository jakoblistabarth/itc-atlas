import type { NextPage } from "next";
import { useRouter } from "next/router";
import CardLink from "../../components/CardLink";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";
import Teaser from "../../components/Teaser";
import SecondaryNavigation from "../../components/SecondaryNavigation";

const Page: NextPage = () => {
  const { route } = useRouter();

  return (
    <PageBase title="ITC's PhDs">
      <Container>
        <main>
          <Teaser>Insights into ITC&apos;s PhDs.</Teaser>

          <SecondaryNavigation>
            <CardLink href={`${route}/departments`}>
              <h2>Per country of origin and department</h2>
            </CardLink>
            <CardLink href={`${route}/theses`}>
              <h2>Overview of ITC&apos;s theses</h2>
            </CardLink>
          </SecondaryNavigation>
        </main>
      </Container>
    </PageBase>
  );
};

export default Page;
