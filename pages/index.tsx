/** @jsxImportSource theme-ui */

import type { NextPage } from "next";
import Head from "next/head";
import Footer from "../components/Footer";
import { Container, Grid, Heading, Text } from "theme-ui";
import CardLink from "../components/CardLink";
import { nanoid } from "nanoid";
import Building, { ITClocations } from "../components/Building";
import { Group } from "@visx/group";
import useMeasure from "react-use-measure";
import Link from "../components/Link";
import IconResearch from "../public/images/icon_research.svg";
import IconEducation from "../public/images/icon_education.svg";
import IconProjects from "../public/images/icon_projects.svg";
import IconIntroduction from "../public/images/icon_introduction.svg";
import IconAppendix from "../public/images/icon_appendix.svg";

const Home: NextPage = () => {
  const links = [
    {
      href: "/travels",
      children: "Travels",
      description: "Insights into ITC's travels around the globe.",
    },
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
      href: "/policies/indonesia",
      children: "Policies",
      description: "Policy changes framing ITC's work.",
    },
    {
      href: "/employees",
      children: "Employees",
      description: "Insights into ITC's staff composition.",
    },
    {
      href: "/applicants",
      children: "Applicants",
      description: "ITC's applicants.",
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
      <Head>
        <title>ITC Atlas</title>
        <meta name="description" content="ITC Atlas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Container>
        <main>
          <div
            sx={{
              width: "100%",
              maxWidth: "960px",
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
          <Text>The impact of capacity development</Text>

          <Heading as="h2">Chapters</Heading>
          <Grid variant="navigation">
            <CardLink href="/introduction">
              <IconIntroduction width={"2em"} height={"2em"} opacity={0.2} />
              <Heading as="h3">Introduction</Heading>
            </CardLink>
            <CardLink href="/research">
              <IconResearch width={"2em"} height={"2em"} opacity={0.2} />
              <Heading as="h3">Chapter Research</Heading>
            </CardLink>
            <CardLink href="/education">
              <IconEducation width={"2em"} height={"2em"} opacity={0.2} />
              <Heading as="h3">Chapter Education</Heading>
            </CardLink>
            <CardLink href="/projects">
              <IconProjects width={"2em"} height={"2em"} opacity={0.2} />
              <Heading as="h3">Chapter Projects</Heading>
            </CardLink>
            <CardLink href="/appendix">
              <IconAppendix width={"2em"} height={"2em"} opacity={0.2} />
              <Heading as="h3">Appendix</Heading>
            </CardLink>
          </Grid>

          <Heading as="h2">Quicklinks</Heading>
          <div
            sx={{
              mt: 3,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gridGap: 2,
            }}
          >
            {links.map((l) => (
              <Link key={nanoid()} href={l.href}>
                {l.children}
              </Link>
            ))}
          </div>
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default Home;
