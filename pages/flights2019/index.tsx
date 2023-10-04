import type { NextPage } from "next";
import { useRouter } from "next/router";
import { Container, Grid, Heading, Text } from "theme-ui";
import CardLink from "../../components/CardLink";
import PageBase from "../../components/PageBase";

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
          <Text variant="teaser">
            Insights into ITC&apos;s travels in 2019.
          </Text>

          <Grid variant="navigation">
            {links.map((l, idx) => (
              <CardLink key={idx} href={l.href}>
                <Heading as="h2">{l.children}</Heading>
              </CardLink>
            ))}
          </Grid>
        </main>
      </Container>
    </PageBase>
  );
};

export default Page;
