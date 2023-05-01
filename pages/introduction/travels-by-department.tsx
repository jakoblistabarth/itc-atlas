/** @jsxImportSource theme-ui */

import type { GetStaticProps, NextPage } from "next";
import { Box, Paragraph } from "theme-ui";
import getCountries from "../../lib/data/getCountries";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import HeroVisualPage from "../../components/HeroVisualPage";
import TravelsByDepartment from "../../components/visuals/TravelsByDepartment";
import getBtorsGroupedByCountry, {
  BtorsGroupedByCountry,
} from "../../lib/data/queries/btors/getBtorsGroupedByCountry";
import Caption from "../../components/Caption";

type Props = {
  btorsByCountry: BtorsGroupedByCountry;
  neCountries: NeCountriesTopoJson;
};

const Page: NextPage<Props> = ({ btorsByCountry, neCountries }) => {
  const heroVisual = (
    <TravelsByDepartment neCountries={neCountries} btors={btorsByCountry} />
  );

  return (
    <HeroVisualPage title="Staff travels by department" heroVisual={heroVisual}>
      <Paragraph variant="teaser">
        Where does ITC staff travel and what for? To answer this question we
        need to take a closer look on different travel destination, the
        development over time and the purpose of these travels. Two datasets are
        the basis for this analysis: the &ldquo;Back to Office Reports&rdquo;
        and all flights booked by ITC&apos;s travel angency for 2019.
      </Paragraph>
      <Box as="section" variant="layout.section">
        <Box
          sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", columnGap: 5 }}
        >
          <Box>
            <Paragraph>
              ITC staff travels for different purposes and for different
              departments. The map above shows the following.
            </Paragraph>
            <Box>
              {heroVisual}
              <Caption reference="Fig. 1">
                This maps shows something specific.
              </Caption>
            </Box>
            <Paragraph>
              ITC staff travels for different purposes and for different
              departments. The map above shows the following.
            </Paragraph>
          </Box>
        </Box>
      </Box>
    </HeroVisualPage>
  );
};

export default Page;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [btorsByCountry, neCountries] = await Promise.all([
    getBtorsGroupedByCountry(),
    getCountries(),
  ]);

  return {
    props: {
      btorsByCountry,
      neCountries,
    },
  };
};
