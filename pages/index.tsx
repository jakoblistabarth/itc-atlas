import { Group } from "@visx/group";
import type { NextPage } from "next";
import { useTheme } from "next-themes";
import useMeasure from "react-use-measure";
import Building, { ITClocations } from "../components/Building";
import ChapterNavigation from "../components/ChapterNavigation";
import Container from "../components/Container";
import Link from "../components/Link";
import PageBase from "../components/PageBase";
import Paragraph from "../components/Paragraph";
import Section from "../components/Section";
import Teaser from "../components/Teaser";
import { useEffect, useState } from "react";

const Home: NextPage = () => {
  const { theme } = useTheme();
  const [isSSR, setIsSSR] = useState(true);
  useEffect(() => {
    setIsSSR(false);
  }, []);

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
      href: "/development-policies",
      children: "Development Policies",
      description: "Policy changes over time.",
    },
    {
      href: "/courses",
      children: "Courses",
      description: "ITC's courses",
    },
  ];

  const [heroVizRef, { width }] = useMeasure();
  const height = width / 5;

  return (
    <PageBase title="Home" renderTitle={false}>
      <Container>
        <Section>
          <div className="h-[220px] w-full p-4">
            {!isSSR && (
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
                        foreground={theme === "light" ? "teal" : "turquoise"}
                        background={theme === "light" ? "white" : "rgb(0,30,0)"}
                      />
                    </Group>
                  );
                })}
              </svg>
            )}
          </div>
          <h1>Atlas of the world of ITC</h1>
          <Teaser>The impact of capacity development</Teaser>
        </Section>

        <Section>
          <Paragraph>
            ITC&apos;s mission is capacity development. We apply, share and
            facilitate the effective use of geo-information and earth
            observation knowledge and tools for tackling global wicked problems.
            Our activities in education and research are applied in our
            knowledge domains of Disaster Resilience, Resource
            Security,Geohealth, and Geo-Ai.
          </Paragraph>
        </Section>

        <ChapterNavigation />

        <Section>
          <h2>Quicklinks</h2>
          <Teaser>based on data sources</Teaser>
          <div className="mt-2 grid grid-cols-3 gap-2">
            {links.map((l, idx) => (
              <Link key={idx} href={l.href}>
                {l.children}
              </Link>
            ))}
          </div>
        </Section>
      </Container>
    </PageBase>
  );
};

export default Home;
