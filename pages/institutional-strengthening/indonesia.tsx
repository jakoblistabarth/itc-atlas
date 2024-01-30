import type { GetStaticProps, NextPage } from "next";
import { Step } from "react-joyride";
import IndonesiaTimeline from "../../components/IndonesiaTimeline";
import Annotations from "../../components/IndonesiaTimeline/Annotations";
import LocatorMap from "../../components/LocatorMap";
import PageHeroVisual from "../../components/PageHeroVisual";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";
import Tour from "../../components/Tour";
import getCountries from "../../lib/data/getCountries";
import getDutchForeignAffairsMinisters from "../../lib/data/getDutchForeignAffairsMinisters";
import getITCNames from "../../lib/data/getITCNames";
import getLongTermMissions from "../../lib/data/getLongTermMissions";
import getPolicyTopics from "../../lib/data/getPolicyTopics";
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
import ProjectPartnersIndonesia from "../../components/ProjectPartnersIndonesia";
import Caption from "../../components/Caption";

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
  neCountries50m: NeCountriesTopoJson;
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
  neCountries50m,
}) => {
  const steps: Step[] = [
    {
      content: (
        <p>
          Due to a conflict between both governments the development relations
          were frozen.
        </p>
      ),
      target: "#target1",
    },
    {
      content: (
        <p>
          In the early years the staff were send for <strong>long</strong> stay
          activities – to set up and run education programs.
        </p>
      ),
      target: "#target2",
    },
    {
      content: (
        <p>
          Later rather <strong>short</strong> collaboration missions – to advise
          and to lecture – took place.
        </p>
      ),
      target: "#target3",
    },
  ];

  const heroVisual = (
    <>
      <IndonesiaTimeline
        projects={projects}
        phdsByYear={phdsByYear}
        applications={applications}
        btors={btors}
        itcNames={itcNames}
        longTermMissions={longTermMissions}
        policyTopics={policyTopics}
        ministers={ministers}
      >
        <Annotations />
      </IndonesiaTimeline>
      <Tour steps={steps} />
    </>
  );

  return (
    <PageHeroVisual title="ITC's impact in Indonesia" heroVisual={heroVisual}>
      <Teaser>
        ITC and changing government policies illustrated by its activities in
        Indonesia.
      </Teaser>
      <Section>
        <div className="grid grid-cols-[2fr_1fr] gap-x-5">
          <div>
            <Paragraph className="mb-10">
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
            <ProjectPartnersIndonesia countries={neCountries50m} />
            <Caption reference="Fig. 1">
              3 Partners are crucial for ITC in Indonesia.
            </Caption>
            <Paragraph className="mt-10">
              In the last decade the thematic focus was more consistent, but the
              geographic focus continues to shift, reflecting political choices.
              Development cooperation is seen as bilateral cooperation among
              stakeholders. From the Dutch side the national government works
              with societal partners such as NGOs, knowledge institutions, and
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
          </div>
          <div>
            <LocatorMap
              neCountriesTopoJson={neCountries}
              highlight={["IDN"]}
              width={250}
            />
            <h2>Indonesia</h2>
            <Paragraph>
              One of the countries ITC is connected to since its beginning.
            </Paragraph>
          </div>
        </div>
      </Section>
    </PageHeroVisual>
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
    neCountries50m,
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
    getCountries("50m"),
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
      neCountries50m,
    },
  };
};
