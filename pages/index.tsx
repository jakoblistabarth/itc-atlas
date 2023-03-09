import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import Footer from "../components/Footer";
import Heading, { Headings } from "../components/Heading";
import LinkFramed from "../components/LinkFramed";
import { nanoid } from "nanoid";
import Building, { ITClocations } from "../components/Building";
import { Group } from "@visx/group";
import useMeasure from "react-use-measure";

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

      <main className={styles.main}>
        {/* TODO: fix css to make it responsive  */}
        <div
          style={{
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
            <line x2={"100%"} y1={width / 5.4} y2={width / 5.4} stroke="teal" />
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
        <Heading className={Headings.H1} Tag={Headings.H1}>
          Atlas of the world of ITC
        </Heading>
        <p className={styles.description}>The impact of capacity development</p>

        <div className={styles.grid}>
          {links.map((l) => (
            <LinkFramed
              key={nanoid()}
              href={l.href}
              description={l.description}
            >
              {l.children}
            </LinkFramed>
          ))}
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Home;
