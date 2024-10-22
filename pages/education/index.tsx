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
    <PageChapter chapterName="Education">
      <Section>
        <h1>Chapter Education</h1>
        <Teaser>
          ITC offers a wide range of high-quality internationally oriented
          education in the field of geo-information science and earth
          observation
        </Teaser>
        <Paragraph>
          The educational programs are offered at different levels. Next to
          several Master of Science programs, ITC provides postgraduate diploma
          courses and, specific (tailor made) short courses. This can be at
          location or online. For this last category our dedicated online
          environment Geoversity is the place to be.
        </Paragraph>
      </Section>

      <Section>
        <ChapterContents
          highlights={[
            {
              href: `${route}/courses`,
              title: "M.Sc. courses",
            },
            {
              href: `${route}/alumni-origin`,
              title: "Alumni",
            },
          ]}
        />
      </Section>
    </PageChapter>
  );
};

export default Introduction;
