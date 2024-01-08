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
              href: "research/departments",
              title: "ITC's departments",
            },
          ]}
        />
      </Section>

      <Section>
        <h2>Departments</h2>
        <div className="grid max-w-2xl gap-3">
          {departments.map((d) => (
            <CardLink href={`/research/department/${d.id}`} key={d.id}>
              <Card.Body>
                <h3>{d.name}</h3>
                <div>
                  {d.id} {d.number}
                </div>
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
