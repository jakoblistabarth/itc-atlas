import type { NextPage } from "next";
import CardLink from "../../components/CardLink";
import { useRouter } from "next/router";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";
import SecondaryNavigation from "../../components/SecondaryNavigation";

const Home: NextPage = () => {
  const { route } = useRouter();

  return (
    <>
      <PageBase title="Playground">
        <Container>
          <SecondaryNavigation>
            {["blockdiagram-test"].map((d) => (
              <CardLink key={d} href={`${route}/${d}`}>
                <h2>{d}</h2>
              </CardLink>
            ))}
          </SecondaryNavigation>
        </Container>
      </PageBase>
    </>
  );
};

export default Home;
