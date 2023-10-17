import type { NextPage } from "next";
import ChapterHeader from "../../components/ChapterHeader";
import ChapterHighlights from "../../components/ChapterHighlights";
import ChapterNavigation from "../../components/ChapterNavigation";
import Footer from "../../components/Footer";
import Seo from "../../components/Seo";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";
import Container from "../../components/Container";
import Paragraph from "../../components/Paragraph";

const Introduction: NextPage = () => {
  return (
    <>
      <Seo title="Introduction" />
      <ChapterHeader chapterName="Introduction" />

      <Container>
        <main>
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
              stakeholders. From the Dutch side the national government works
              with societal partners such as NGO&apos;s, knowledge institutions,
              and the private sector.
            </Paragraph>
          </Section>

          <Section>
            <ChapterHighlights
              highlights={[
                {
                  href: "introduction/indonesia",
                  title: "ITC's impact in Indonesia",
                },
                { href: "introduction/travels", title: "ITC's travels" },
                { href: "", title: "A brief history of GIS technology" },
              ]}
            />
          </Section>

          <ChapterNavigation title="Other chapters" />
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Introduction;
