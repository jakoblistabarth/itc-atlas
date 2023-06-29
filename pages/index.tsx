/** @jsxImportSource theme-ui */

import type { NextPage } from "next";
import Footer from "../components/Footer";
import { Box, Container, Heading, Paragraph, Text } from "theme-ui";
import Building, { ITClocations } from "../components/Building";
import { Group } from "@visx/group";
import useMeasure from "react-use-measure";
import Link from "../components/Link";
import ChapterNavigation from "../components/ChapterNavigation";
import Seo from "../components/Seo";
import Header from "../components/Header";

const Home: NextPage = () => {
  const links = [
    {
      href: "/btors",
      children: "Back to Office Reports",
      description: "Insights into ITC's travels around the globe.",
    },
    {
      href: "/flights2019",
      children: "Flights 2019",
      description: "Insights into ITC's travels of 2019.",
    },
    {
      href: "/projects",
      children: "Projects",
      description: "Insight into ITC's activity throughout the decades.",
    },
    {
      href: "/introduction/indonesia",
      children: "Policies",
      description: "Policy changes framing ITC's work.",
    },
    {
      href: "/employees",
      children: "Employees",
      description: "Insights into ITC's employee composition.",
    },
    {
      href: "/employments",
      children: "Employments",
      description: "Insights into ITC's emplpoyments.",
    },
    {
      href: "/applicants",
      children: "Applicants",
      description: "ITC's applicants.",
    },
    {
      href: "/applications",
      children: "Applications",
      description: "ITC's applications.",
    },
    {
      href: "/phds",
      children: "PhDs",
      description: "ITC's PhDs and PhD candidates.",
    },
    {
      href: "/nfpcountries",
      children: "NFP Countries",
      description: "Policy changes over time.",
    },
    {
      href: "/ui",
      children: "UI Tests",
      description: "For development only.",
    },
  ];

  const [heroVizRef, { width }] = useMeasure();
  const height = width / 5;

  return (
    <>
      <Seo title="Home" />
      <Header />

      <Container>
        <main>
          <Box as="section" variant="layout.section">
            <div
              sx={{
                width: "100%",
                height: "220px",
                padding: "1em",
              }}
            >
              <svg
                ref={heroVizRef}
                width="100%"
                height="100%"
                viewBox={`0 0 ${width} ${height}`}
              >
                <line
                  x2={"100%"}
                  y1={width / 5.4}
                  y2={width / 5.4}
                  stroke="teal"
                />
                {Array.from(ITClocations.entries()).map(([location], i) => {
                  const buildingWith = width / 4;
                  return (
                    <Group
                      key={location}
                      top={buildingWith / 2}
                      left={buildingWith + (i * buildingWith) / 2}
                    >
                      <Building
                        width={buildingWith}
                        location={location}
                        color={"teal"}
                      />
                    </Group>
                  );
                })}
              </svg>
            </div>
            <Heading as="h1">Atlas of the world of ITC</Heading>
            <Text variant="teaser">The impact of capacity development</Text>
          </Box>

          <Box as="section" variant="layout.section">
            <Paragraph>
              ITC’s mission is capacity development. We apply, share and
              facilitate the effective use of geo-information and earth
              observation knowledge and tools for tackling global wicked
              problems. Our activities in education and research are applied in
              our knowledge domains of Disaster Resilience, Resource
              Security,Geohealth, and Geo-Ai.
            </Paragraph>
          </Box>

          <ChapterNavigation />

          <Box as="section" variant="layout.section">
            <Heading as="h2">Quicklinks</Heading>
            <Paragraph variant="teaser">based on data sources</Paragraph>
            <div
              sx={{
                mt: 3,
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gridGap: 2,
              }}
            >
              {links.map((l, idx) => (
                <Link key={idx} href={l.href}>
                  {l.children}
                </Link>
              ))}
            </div>
          </Box>
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Home;
