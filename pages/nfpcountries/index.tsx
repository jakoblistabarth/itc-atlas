import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Footer from "../../components/Footer";
import Heading, { Headings } from "../../components/Heading";
import getNfpCountries from "../../lib/data/getNfpCountries";
import styles from "../../styles/home.module.css";
import * as d3 from "d3";
import { NfpCountry } from "../../types/NfpCountry";
import { nanoid } from "nanoid";

type Props = {
  nfps: NfpCountry[];
};

const NfpCountries: NextPage<Props> = ({ nfps }) => {
  const width = 900;
  const margin = 20;
  const maxSize = 50;

  const yearDomain = d3.extent(
    nfps.map((nfp) => new Date(nfp.year.toString()))
  );
  const perYear = d3.group(nfps, (d) => d.year);
  const countDomain = d3.extent(
    [...Array.from(perYear.values())].map((countries) => countries.length)
  );

  const scale = d3
    .scaleSqrt()
    .domain([countDomain[0] ?? 0, countDomain[1] ?? 100])
    .range([3, maxSize / 2]);
  const scaleTime = d3
    .scaleTime()
    .domain([yearDomain[0] ?? new Date("1900"), yearDomain[1] ?? new Date()])
    .range([0, width - margin * 2 - maxSize * 2]);

  return (
    <>
      <Head>
        <title>NFP Countries</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>NFP Countries</Heading>

        <p className={styles.description}>Insights into NFP Countries.</p>
        <svg width={width} height={200}>
          <g transform={`translate(${margin}, ${margin})`}>
            {d3
              .range(
                yearDomain[0]?.getFullYear() ?? 0,
                (yearDomain[1]?.getFullYear() ?? 0) + 1,
                1
              )
              .map((year) => {
                const yearDate = new Date(year.toString());
                const yearData = perYear.get(new Date(year));
                return (
                  <g
                    key={nanoid()}
                    transform={`translate(${scaleTime(yearDate)}, ${maxSize})`}
                  >
                    <circle
                      cx={maxSize}
                      cy={0}
                      r={yearData ? scale(yearData.length) : 1}
                      fill={yearData ? "black" : "lightgrey"}
                      fillOpacity={yearData ? 0.2 : 1}
                      stroke={yearData ? "black" : "none"}
                    />
                    <line
                      x1={maxSize}
                      y1={5}
                      x2={maxSize}
                      y2={maxSize / 2 + 5}
                      strokeWidth={0.5}
                      stroke={"grey"}
                    />
                    <text
                      fontSize={"10"}
                      textAnchor="middle"
                      x={maxSize}
                      y={maxSize / 2 + 20}
                    >
                      {year}
                    </text>
                  </g>
                );
              })}
          </g>
        </svg>
      </main>

      <Footer />
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const nfps = getNfpCountries();
  return {
    props: {
      nfps,
    },
  };
};

export default NfpCountries;
