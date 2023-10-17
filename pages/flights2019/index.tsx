import type { NextPage } from "next";
import { useRouter } from "next/router";
import CardLink from "../../components/CardLink";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";
import Teaser from "../../components/Teaser";
import SecondaryNavigation from "../../components/SecondaryNavigation";

const Page: NextPage = () => {
  const { route } = useRouter();

  const links = [
    {
      href: `${route}/airports`,
      children: "Airports",
    },
    {
      href: `${route}/flights`,
      children: "Flights (map)",
    },
    {
      href: `${route}/flights3D`,
      children: "Flights (globe)",
    },
  ];

  return (
    <PageBase title="Flights 2019">
      <Container>
        <main>
          <Teaser>Insights into ITC&apos;s travels in 2019.</Teaser>

          <SecondaryNavigation>
            {links.map((l, idx) => (
              <CardLink key={idx} href={l.href}>
                <h2>{l.children}</h2>
              </CardLink>
            ))}
          </SecondaryNavigation>
        </main>
      </Container>
    </PageBase>
  );
};

export default Page;
