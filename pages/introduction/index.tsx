import type { NextPage } from "next";
import ChapterContents from "../../components/ChapterContents";
import PageChapter from "../../components/PageChapter";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";
import { useRouter } from "next/router";

const Introduction: NextPage = () => {
  const { route } = useRouter();
  return (
    <PageChapter chapterName="Introduction">
      <Section>
        <h1>Chapter Introduction</h1>
        <Teaser>
          Introducing one of the world leading institutions for academic
          education and research in earth observation and geo-information
        </Teaser>
        <Paragraph>
          This section offers an overview of ITC&apos;s capacity building
          objectives and the context in which it operates. ITC works with
          (inter) national governments and societal partners such as NGOs,
          knowledge institutions, and the private sector.
        </Paragraph>
      </Section>

      <Section>
        <ChapterContents
          highlights={[
            {
              href: `${route}/about-itc`,
              title: "About ITC",
            },
            {
              href: `${route}/capacity-building-impact`,
              title: "Capacity building and impact",
            },
            {
              href: `${route}/development-policies`,
              title: "How development policies affect ITC",
            },
            {
              href: `${route}/travels`,
              title: "Connecting to the world",
            },
            {
              href: `${route}/travels-2019`,
              title: "Lookig closely – staff travels in 2019",
            },
          ]}
        />
      </Section>
    </PageChapter>
  );
};

export default Introduction;
