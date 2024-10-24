import { Department } from "@prisma/client";
import type { GetStaticProps, NextPage } from "next";
import { Card } from "../../components/Card";
import CardLink from "../../components/CardLink";
import ChapterContents from "../../components/ChapterContents";
import PageChapter from "../../components/PageChapter";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";
import getDepartments from "../../lib/data/queries/departments/getDepartments";
import { useRouter } from "next/router";

type Props = {
  departments: Department[];
};

const Introduction: NextPage<Props> = ({ departments }) => {
  const { route } = useRouter();
  return (
    <PageChapter chapterName="Research">
      <Section>
        <h1>Chapter Research</h1>
        <Teaser>
          The research programme of ITC develops cutting-edge knowledge and
          innovative approaches in the field of geo-information science and
          earth observation.
        </Teaser>
        <Paragraph>
          ITC carries out research within the framework of a coherent research
          programme that addresses specific development-related problem fields
          in geo-information science and earth observation.
        </Paragraph>
        <Paragraph>
          This yields new tools and methods for the collection, storage and
          processing of geospatial data and pioneers new applications of
          geospatial data to societal problems in which geo-information science
          and earth observation play an important role.
        </Paragraph>
        <Paragraph>
          Specific domain knowledge is developed by the chair groups in the six
          scientific department and accumulates in the profiling themes. PhD
          students play a prominent role. The research topics are closely linked
          to national and international research agenda&apos;s as well as the
          themes of the Dutch development cooperation program.
        </Paragraph>
        <Paragraph>The profiling themes address problems related to:</Paragraph>
        <ul className="max-w-2xl [&>li]:my-5">
          <li>
            <strong>GeoAI</strong> - Integrates innovations in geospatial
            technologies with the rapid advancements in AI and big data. The
            goal is to responsibly translate complex, contextual data into
            useful information.
          </li>
          <li>
            <strong>Urban Futures</strong> - Aims to understand and address
            social, environmental, economic, and land tenure challenges in urban
            areas. It applies innovative geospatial solutions to develop
            people-centric and digitally-informed strategies that support the
            transition towards safe, healthy, liveable, resilient, and just
            urban futures.
          </li>
          <li>
            <strong>Resource Security</strong> - Focuses on the fair and
            sustainable use of our natural environment. This includes the
            planning and management of environmental resources such as food,
            water, biodiversity, minerals, energy, and land, ensuring their
            equitable availability for all societies.
          </li>
          <li>
            <strong>Disaster Resilience</strong> - Incorporates hazard
            assessment and disaster risk management into strategic planning and
            sustainable development initiatives.
          </li>
        </ul>
      </Section>

      <Section>
        <ChapterContents
          highlights={[
            {
              href: route + "/phds",
              title: "ITC's PhD theses and origins",
            },
          ]}
        />
      </Section>

      <Section>
        <h2>Departments</h2>
        <Paragraph>
          ITC&apos;s domain specific research is done by staff and phd students
          in its 6 scientific departments. Below an overview activities of each
          department. Please note that many research and education activities
          are carried out across several of these departments.
        </Paragraph>
        <div className="mt-10 grid max-w-2xl grid-cols-[repeat(auto-fill,_minmax(360px,_1fr))] gap-3">
          {departments
            .sort((a, b) => {
              if (a.id > b.id) {
                return 1;
              }
              return -1;
            })
            .map((d) => (
              <CardLink href={`/research/department/${d.id}`} key={d.id}>
                <Card.Body>
                  <h3>{d.name}</h3>
                  <div>{d.id}</div>
                </Card.Body>
              </CardLink>
            ))}
        </div>
      </Section>
    </PageChapter>
  );
};

export default Introduction;

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [departments] = await Promise.all([getDepartments(true)]);

  return {
    props: {
      departments,
    },
  };
};
