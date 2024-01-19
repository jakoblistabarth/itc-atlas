import type { NextPage } from "next";
import ChapterHighlights from "../../components/ChapterHighlights";
import PageChapter from "../../components/PageChapter";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";

const Introduction: NextPage = () => {
  return (
    <PageChapter chapterName="Introduction">
      <Section>
        <h1>Chapter Introduction</h1>
        <Teaser>
          Introducing one of the world leading institutions for academic
          education and research in earth observation and geo-information
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
              href: "/development-policies",
              title: "How development policies affect ITC",
            },
            {
              href: "/introduction/travels",
              title: "In 75 years around the world",
            },
            { href: "/travels2019", title: "ITC's travels in 2019" },
          ]}
        />
      </Section>
    </PageChapter>
  );
};

export default Introduction;
