import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/home.module.css";
import Footer from "../components/Footer";
import Heading, { Headings } from "../components/Heading";
import LinkFramed from "../components/LinkFramed";
import { nanoid } from "nanoid";

const Home: NextPage = () => {
  const links = [
    {
      href: "/travels",
      children: "Travels",
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
      href: "/staff",
      children: "Staff",
      description: "Insights into ITC's staff composition.",
    },
    {
      href: "/applicants",
      children: "Applicants",
      description: "ITC's applicants.",
    },
    {
      href: "/alumni",
      children: "Alumni",
      description: "ITC's alumni.",
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

  return (
    <>
      <Head>
        <title>ITC Atlas</title>
        <meta name="description" content="ITC Atlas" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>
          Capacity <em>Building</em> of ITC
        </Heading>

        <p className={styles.description}>A prototype of ITC's hybrid atlas</p>

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
