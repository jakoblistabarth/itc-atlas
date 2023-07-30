/** @jsxImportSource theme-ui */

import type { NextPage } from "next";
import Footer from "../../components/Footer";
import { Box, Container, Heading, Paragraph, Text } from "theme-ui";
import ChapterNavigation from "../../components/ChapterNavigation";
import Seo from "../../components/Seo";
import Header from "../../components/Header";
import { MdArrowForward } from "react-icons/md";
import Link from "../../components/Link";

const Home: NextPage = () => {
  return (
    <>
      <Seo title="Introduction" />

      <Box
        sx={{
          background: "primary",
        }}
      >
        <Header />
        <Box
          sx={{
            py: 6,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Text
            sx={{
              fontFamily: "Fraunces",
              fontStyle: "italic",
              color: "background",
              fontSize: [2, 7],
            }}
          >
            Introduction
          </Text>
        </Box>
      </Box>

      <Container>
        <main>
          <section sx={{ my: 4 }}>
            <Heading as="h1">Chapter Introduction</Heading>
            <Text variant="teaser">Introducing ITC</Text>
            <Paragraph>
              The last decade the thematic focus was more consistent, but the
              geographic focus continues to shift, reflecting political choices.
              Development cooperation is seen as bilateral cooperation among
              stakeholders. From the Dutch side the national government works
              with societal partners such as ngo’s, knowledge institutions, and
              the private sector.
            </Paragraph>
          </section>

          <Box
            sx={{
              p: 3,
              borderRadius: 2,
              my: 4,
              background: "muted",
            }}
          >
            <Heading as="h2">Highlights</Heading>
            <ul
              sx={{
                listStyleType: "none",
                pl: 0,
                li: { mt: 2, display: "flex", alignItems: "center" },
              }}
            >
              {[
                {
                  href: "introduction/indonesia",
                  title: "ITC's impact in Indonesia",
                },
                { href: "introduction/travels", title: "ITC's travels" },
                { href: "", title: "A brief history of GIS technology" },
              ].map(({ href, title }, i) => (
                <li key={i}>
                  <MdArrowForward sx={{ mr: 2 }} />
                  <Link href={href}>{title}</Link>
                </li>
              ))}
            </ul>
          </Box>

          <ChapterNavigation title="Other chapters" />
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Home;
