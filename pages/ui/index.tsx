/** @jsxImportSource theme-ui */

import type { NextPage } from "next";
import { Grid } from "theme-ui";
import CardLink from "../../components/CardLink";
import { useRouter } from "next/router";
import BasePage from "../../components/BasePage";

const Home: NextPage = () => {
  const { route } = useRouter();

  return (
    <>
      <BasePage title="UI tests">
        <Grid variant="navigation">
          {["shader-test", "three-test"].map((d) => (
            <CardLink key={d} href={`${route}/${d}`}>
              {d}
            </CardLink>
          ))}
        </Grid>
      </BasePage>
    </>
  );
};

export default Home;
