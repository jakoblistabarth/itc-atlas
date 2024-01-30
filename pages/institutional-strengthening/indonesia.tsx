import type { GetStaticProps, NextPage } from "next";
import Image from "next/image";
import { Step } from "react-joyride";
import Caption from "../../components/Caption";
import IndonesiaTimeline from "../../components/IndonesiaTimeline";
import Annotations from "../../components/IndonesiaTimeline/Annotations";
import LocatorMap from "../../components/LocatorMap";
import PageHeroVisual from "../../components/PageHeroVisual";
import Paragraph from "../../components/Paragraph";
import ProjectPartnersIndonesia from "../../components/ProjectPartnersIndonesia";
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
    <PageHeroVisual
      title="Impact of policy changes on ITC’s efforts in capacity building"
      heroVisual={heroVisual}
    >
      <Teaser>Illustrated by our activities in Indonesia</Teaser>
      <Section>
        <div className="grid grid-cols-[2fr_1fr] gap-x-5">
          <div>
            <Section>
              <Paragraph>
                The infographic on this page relates three components that has
                shaped the context in which ITC operates. On top ITC&apos;s own
                history. On the timeline the changes of ITC&apos;s full name
                reflect the development of the domain in which ITC is active. It
                started as International Training Centre for Aerial survey
                (ITC), later Earth Sciences was added, than Aerial survey was
                replaced by Aero space Surveys, and today ITC is the Faculty of
                Geoinformation Sciences and Earth Observation. The profile of
                the buildings that housed ITC over time represent our geographic
                journey [see also page 11:2].
              </Paragraph>

              <Paragraph>
                In the centre of the infographic the different Ministers
                responsible for development aid and her/his political signature
                [see page xx:y for the different Administrations]. The attitude
                to development is reflected in the name of the Ministry
                responsible. In 1965 it starts of as Ministry of Development
                Aid, in 1971 this changed to Development Cooperation, and since
                2012 it is about Foreign Trade and Development Cooperation.
                Although poverty reduction has always been a focus topic, these
                day the topics water, food, health and climate are also in
                focus.
              </Paragraph>
              <figure className="my-10">
                <ProjectPartnersIndonesia countries={neCountries50m} />
                <Caption reference="Fig.1">
                  3 Partners are crucial for ITC in Indonesia.
                </Caption>
              </figure>
              <Paragraph>
                These developments also influenced the relation between ITC and
                the stakeholders in the target countries, from more
                paternalistic to equal partnership. In Indonesia this can be
                seen in the project related travels. In the twentieth century,
                visits of ITC were of long duration with long assignments,
                nowadays these are short trips only.
              </Paragraph>
            </Section>
            <Section>
              <Paragraph>
                ITC has been active in Indonesia for a large part of its
                existence. Some of the collaborations go back to the late 60s
                and 70s of last century. This long period illustrates the way in
                which activities have been adapted to policies of the
                Netherlands Government and other conditions. Over time the way
                of working in partnerships has changed from long-term projects
                with resident staff to large collaborative projects with local
                partners, including alumni [See page 14: 1 staff travel]. The
                main aim in the early days of these collaborations was to
                establish and support institutions that would operate as a
                engine for generating change, gradually taking over the role
                that ITC has been playing. The long-term partnerships made it
                possible to build up a critical mass of well-educated staff with
                the capacity to take on leadership roles in their own
                organization and contribute to a change in the way of working.
              </Paragraph>
              <Paragraph>
                Examples of these early corporations are the establishment of
                the Faculty of Geography at Gadjah Mada University (UGM) in
                Yogyakarta, building up the Centre for Education in
                Photogrammetry and Cartography (PPFK) at the Technical
                University Bandung (ITB), the collaboration with the Indonesia’s
                National Mapping Agency Bakosurtanal, now the Geospatial
                Information Agency (BIG)), and collaboration with the training
                institute of the Ministry of Forestry (Balai Latihan Kehutanan,
                BLK), and the regional planning project in the Moluccas. In all
                these activities use was made of long- term resident postings of
                ITC staff.
              </Paragraph>
              <Paragraph>
                Today alumni play a significant role in the collaborative
                projects, with ITC more in a coaching role at a distance. An
                example is GEOCAP(2014-2019). This goes together with a shift in
                funding from almost exclusively Netherlands official development
                assistance to Indonesian organizations such as LPDP and BRIN.
              </Paragraph>
              <figure className="my-10">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/240117-projects-indonesia.png`}
                  width={1920}
                  height={1357}
                  alt={`Projects in Indonesia`}
                />
                <Caption reference="Fig.2">
                  The geographic distribution of projects executed by ITC in
                  Indonesia over time.
                </Caption>
              </figure>
            </Section>
            <Section>
              <Paragraph>
                Indonesia is one of the counties with the largest alumni
                population [see also page; [1]). Over 1800 students have
                participated in all kind of courses varying between a refresher
                courses on site of two weeks to a two year MSc and four years
                Phd program in the Netherlands. A quarter of the alumni is
                female, and course in there applied earth science have been most
                popular. The distribution of the alumni over Indonesia seems
                similar to the general population distribution, but is skewed to
                the project activities over time; Ambon is a good example of
                this.
              </Paragraph>
              <figure className="my-10">
                <Image
                  src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/240124-alumni-indonesia.png`}
                  width={1920}
                  height={1357}
                  alt={`Projects in Indonesia`}
                />
                <Caption reference="Fig.2">
                  The geographic distribution of alumni in Indonesia
                </Caption>
              </figure>
            </Section>
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
