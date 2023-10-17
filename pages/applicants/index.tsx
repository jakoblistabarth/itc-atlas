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
    <PageBase title="ITC's applicants">
      <Container>
        <main>
          <Teaser>Insights into ITC&apos;s applicants.</Teaser>

          <SecondaryNavigation>
            <CardLink href={`${route}/origin-country`}>
              <h2>Alumni by country</h2>
            </CardLink>
          </SecondaryNavigation>
        </main>
      </Container>
    </PageBase>
  );
};

export default Page;
