/** @jsxImportSource theme-ui */

import type { GetStaticProps, NextPage } from "next";
import { Box, Heading, Paragraph } from "theme-ui";
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
import getPhdsByYear, {
  PhdsByYearWithCount,
} from "../../lib/data/queries/phd/getPhdsByYear";
import { LongTermMission } from "../../types/LongTermMission";
import { Minister } from "../../types/Minister";
import { NeCountriesTopoJson } from "../../types/NeTopoJson";
import { ProjectIndonesia } from "../../types/Project";

import HeroVisualPage from "../../components/HeroVisualPage";
import getITCNames from "../../lib/data/getITCNames";
import getPolicyTopics from "../../lib/data/getPolicyTopics";

type Props = {
  projects: ProjectIndonesia[];
  phdsByYear: PhdsByYearWithCount;
  applications: ApplicationByYearWithCount;
  btors: BtorsByCountry;
  longTermMissions: LongTermMission[];
  ministers: Minister[];
  itcNames: ReturnType<typeof getITCNames>;
  policyTopics: ReturnType<typeof getPolicyTopics>;
  neCountries: NeCountriesTopoJson;
};

const Page: NextPage<Props> = ({
  projects,
  phdsByYear,
  applications,
  btors,
  longTermMissions,
  ministers,
  itcNames,
  policyTopics,
  neCountries,
}) => {
  const heroVisual = (
    <IndonesiaTimeline
      projects={projects}
      phdsByYear={phdsByYear}
      applications={applications}
      btors={btors}
      itcNames={itcNames}
      longTermMissions={longTermMissions}
      policyTopics={policyTopics}
      ministers={ministers}
    />
  );

  return (
    <HeroVisualPage title="ITC's Impact in Indonesia" heroVisual={heroVisual}>
      <Paragraph variant="teaser">
        ITC and changing government policies illustrated by its activities in
        Indonesia.
      </Paragraph>
      <Box as="section" variant="layout.section">
        <Box
          sx={{ display: "grid", gridTemplateColumns: "2fr 1fr", columnGap: 5 }}
        >
          <Box>
            <Paragraph>
              During the twentieth century traditional development cooperation
              was oriented to poverty reduction and rather broad in scope and
              geography. Pronk, Minister for Development Cooperation for more
              than fifteen years, was an important proponent of this approach.
              His successor, Herfkens started a process of reorientation of the
              policy resulting in an approach that let bilateral cooperation
              serve as a stimulant for broader societal processes of change. It
              laid the foundation for what is known today as the policy for
              foreign trade and development cooperation. In the early
              twenty-first century one searched for an effective and coherent
              approach in development cooperation. This period showed a
              variation in thematic as well as geographic focus.
            </Paragraph>
            <Paragraph>
              In the last decade the thematic focus was more consistent, but the
              geographic focus continues to shift, reflecting political choices.
              Development cooperation is seen as bilateral cooperation among
              stakeholders. From the Dutch side the national government works
              with societal partners such as NGO’s, knowledge institutions, and
              the private sector.
            </Paragraph>
            <Paragraph>
              Thematically it developed a focus on major global issues such as
              stability and security, knowledge development and migration
              policy. The topics promoted for the last twenty years are related
              to subjects where there is a good track record and where a serious
              difference can be made: water, agriculture and food security,
              sexual and reproductive health and rights, as well as security and
              rule of law. The political signature of the government often
              affects the detailed description of these topics.
            </Paragraph>
            <Paragraph>
              Over time the relation between ITC and the stakeholders in the
              target countries also changed, from more paternalistic to equal
              partnership. In Indonesia this can be seen in the project related
              travels. In the twentieth century, visits of ITC staff were long,
              often for instance via resident postings for more than half a year
              to develop and implement a curriculum. The last decades trips
              became shorter for instance to participate in joint workshops.
              More detailed information on the long standing relation between
              ITC and Indonesia can be found in the finished Atlas.
            </Paragraph>
          </Box>
          <Box>
            <Heading as="h2">Indonesia</Heading>
            <LocatorMap
              neCountriesTopoJson={neCountries}
              highlight={["IDN"]}
              width={250}
              roundMarkers={[
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
        </Box>
      </Box>
    </HeroVisualPage>
  );
};

export default Page;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [
    projects,
    phdsByYear,
    btors,
    longTermMissions,
    applications,
    ministers,
    itcNames,
    policyTopics,
    neCountries,
  ] = await Promise.all([
    getProjectsIndonesia(),
    getPhdsByYear("IDN"),
    getBTORsByCountry("IDN"),
    getLongTermMissions(),
    getApplicationsByYear("IDN"),
    getDutchForeignAffairsMinisters(),
    getITCNames(),
    getPolicyTopics(),
    getCountries(),
  ]);

  return {
    props: {
      projects,
      phdsByYear,
      btors,
      longTermMissions,
      applications,
      ministers,
      itcNames,
      policyTopics,
      neCountries,
    },
  };
};
