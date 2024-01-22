import { Department } from "@prisma/client";
import type { GetStaticProps, NextPage } from "next";
import { Card } from "../../components/Card";
import CardLink from "../../components/CardLink";
import ChapterHighlights from "../../components/ChapterHighlights";
import PageChapter from "../../components/PageChapter";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";
import getDepartments from "../../lib/data/queries/departments/getDepartments";

type Props = {
  departments: Department[];
};

const Introduction: NextPage<Props> = ({ departments }) => {
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
          The last decade the thematic focus was more consistent, but the
          geographic focus continues to shift, reflecting political choices.
          Development cooperation is seen as bilateral cooperation among
          stakeholders. From the Dutch side the national government works with
          societal partners such as NGO&apos;s, knowledge institutions, and the
          private sector.
        </Paragraph>
      </Section>

      <Section>
        <ChapterHighlights
          highlights={[
            {
              href: "/phds/theses",
              title: "ITC's PhD theses",
            },
          ]}
        />
      </Section>

      <Section>
        <h2>Departments</h2>
        <Paragraph>
          ITC&apos;s research materializes in its {departments.length}{" "}
          scientific departments. We gathered an overview on the activities of
          each department. Please note that many research and edcuation
          activites are carried out accross several of these departments.
        </Paragraph>
        <div className="mt-10 grid max-w-2xl grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-3">
          {departments.map((d) => (
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
