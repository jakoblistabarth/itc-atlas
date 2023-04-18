/** @jsxImportSource theme-ui */

import type { GetStaticProps, NextPage } from "next";
import { Box, Heading } from "theme-ui";
import LocatorMap from "../../components/map/LocatorMap";
import IndonesiaTimeline from "../../components/IndonesiaTimeline";
import getCountries from "../../lib/data/getCountries";
import getDutchForeignAffairsMinisters from "../../lib/data/getDutchForeignAffairsMinisters";
import getLongTermMissions from "../../lib/data/getLongTermMissions";
import getProjectsIndonesia from "../../lib/data/getProjectsIndonesia";
import getApplicationsByYear, {
  ApplicationByYearWithCount,
} from "../../lib/data/queries/application/getApplicationsByYear";
import getBTORsByCountry, {
  BtorsByCountry,
} from "../../lib/data/queries/btors/getBTORsByCountry";
import getPhdCandidatesByYear, {
  phdCandidateByYearWithCount,
} from "../../lib/data/queries/phdCandidate/getPhdCandidatesByYear";
import { LongTermMission } from "../../types/LongTermMission";
import { Minister } from "../../types/Minister";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { ProjectIndonesia } from "../../types/Project";

import BasePage from "../../components/BasePage";

type Props = {
  projects: ProjectIndonesia[];
  phdGraduatesByYear: phdCandidateByYearWithCount;
  applications: ApplicationByYearWithCount;
  btors: BtorsByCountry;
  longTermMissions: LongTermMission[];
  ministers: Minister[];
  neCountries: NeCountriesTopoJson;
};

const Page: NextPage<Props> = ({
  projects,
  phdGraduatesByYear,
  applications,
  btors,
  longTermMissions,
  ministers,
  neCountries,
}) => {
  return (
    <BasePage title="ITC's Impact in Indonesia">
      <IndonesiaTimeline
        projects={projects}
        phdGraduatesByYear={phdGraduatesByYear}
        applications={applications}
        btors={btors}
        longTermMissions={longTermMissions}
        ministers={ministers}
      />
      <Box as="section" variant="layout.section">
        <Heading as="h2">Indonesia</Heading>
        <LocatorMap
          neCountriesTopoJson={neCountries}
          highlight={["IDN"]}
          width={500}
          markers={[
            {
              lng: 106.5,
              lat: -6,
              fill: "red",
              labelColor: "white",
              label: "A",
              fontSize: 10,
            },
            {
              lng: 106.8,
              lat: -6.5,
              fill: "darkred",
              labelColor: "white",
              fontSize: 10,
              label: "B",
            },
            {
              lng: 110,
              lat: -7.5,
              fill: "red",
              labelColor: "white",
              label: "C",
              fontSize: 10,
            },
          ]}
        />
      </Box>
    </BasePage>
  );
};

export default Page;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [
    projects,
    phdGraduatesByYear,
    btors,
    longTermMissions,
    applications,
    ministers,
    neCountries,
  ] = await Promise.all([
    getProjectsIndonesia(),
    getPhdCandidatesByYear("IDN"),
    getBTORsByCountry("IDN"),
    getLongTermMissions(),
    getApplicationsByYear("IDN"),
    getDutchForeignAffairsMinisters(),
    getCountries(),
  ]);

  return {
    props: {
      projects,
      phdGraduatesByYear,
      btors,
      longTermMissions,
      applications,
      ministers,
      neCountries,
    },
  };
};
