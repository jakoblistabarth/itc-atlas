/** @jsxImportSource theme-ui */

import type { NextPage } from "next";
import { Box, Container, Heading, Paragraph } from "theme-ui";
import ChapterHeader from "../../components/ChapterHeader";
import ChapterHighlights from "../../components/ChapterHighlights";
import ChapterNavigation from "../../components/ChapterNavigation";
import Footer from "../../components/Footer";
import Seo from "../../components/Seo";

const Introduction: NextPage = () => {
  return (
    <>
      <Seo title="Introduction" />
      <ChapterHeader chapterName="Introduction" />

      <Container>
        <main>
          <Box as={"section"} variant={"layout.section"}>
            <Heading as="h1">Chapter Introduction</Heading>
            <Paragraph variant="teaser">
              Introducing one of the world leading institutions for academic
              education and research in earth observation and geo-information
            </Paragraph>
            <Paragraph>
              The last decade the thematic focus was more consistent, but the
              geographic focus continues to shift, reflecting political choices.
              Development cooperation is seen as bilateral cooperation among
              stakeholders. From the Dutch side the national government works
              with societal partners such as ngo’s, knowledge institutions, and
              the private sector.
            </Paragraph>
          </Box>

          <Box as={"section"} variant={"layout.section"}>
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
          </Box>

          <ChapterNavigation title="Other chapters" />
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Introduction;
