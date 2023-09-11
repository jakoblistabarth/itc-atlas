/** @jsxImportSource theme-ui */

import type { NextPage } from "next";
import { Grid } from "theme-ui";
import CardLink from "../../components/CardLink";
import { useRouter } from "next/router";
import PageBase from "../../components/PageBase";

const Home: NextPage = () => {
  const { route } = useRouter();

  return (
    <>
      <PageBase title="UI tests">
        <Grid variant="navigation">
          {["shader-test", "three-test", "maplayoutfluid-test"].map((d) => (
            <CardLink key={d} href={`${route}/${d}`}>
              {d}
            </CardLink>
          ))}
        </Grid>
      </PageBase>
    </>
  );
};

export default Home;
