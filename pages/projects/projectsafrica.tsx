import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import styles from "../../styles/home.module.css";
import { geoSatellite } from "d3-geo-projection";
import * as d3 from "d3";
import * as topojson from "topojson-client";
import { Project } from "../../types/Project";
import getCountries from "../../lib/data/getCountries";
import getProjects from "../../lib/data/getProjects";
import BaseLayer from "../../components/map/BaseLayer";
import Heading, { Headings } from "../../components/Heading";
import { FeatureCollection, Feature, Point, MultiPolygon } from "geojson";
import type { AreaCode } from "../../types/UnsdCodes";
import getUnsdCountries from "../../lib/data/getUnsdCountries";
import { nanoid } from "nanoid";
import themes, { ThemeNames } from "../../lib/styles/themes";
import ChoroplethSymbol from "../../components/map/ChoroplethSymbol";
import { MapOptions } from "../../types/MapOptions";
import PatternDots from "../../components/defs/patterns/PatternDots";
import IsoUnit from "../../components/map/IsoUnit";
import { SharedPageProps } from "../../types/Props";
import defaultTheme from "../../lib/styles/themes/defaultTheme";

type Props = {
  projects: Project[];
  areaCodes: AreaCode[];
} & SharedPageProps;

const ProjectCountries: NextPage<Props> = ({
  projects,
  areaCodes,
  neCountriesTopoJson,
}) => {
  const mapOptions: MapOptions = {
    bounds: {
      width: 1080,
      height: 550,
    },
    projection: geoSatellite()
      .scale(1280)
      .rotate([-20, -15, 180])
      .tilt(10)
      .distance(2)
      .translate([1080 / 2, 750]),
    theme: themes.get(ThemeNames.RAISZ) ?? defaultTheme,
  };

  const count = d3
    .rollups(
      projects
        .filter((project) =>
          project.countries.some((code) => {
            const match = areaCodes.find(
              (area) => area["ISO-alpha3 Code"] === code
            );
            if (!match) return;
            return match["Region Name"] === "Africa";
          })
        )
        .reduce((acc: string[], proj) => {
          acc.push(...proj.countries); // or proj.allCountries
          return acc;
        }, []),
      (v) => v.length,
      (d) => d
    )
    .sort((a, b) => d3.descending(a[1], b[1]));
  const projectsCountry = new Map(count);

  const minHeight = 2;
  const maxHeight = 150;

  const projectCount = Array.from(projectsCountry.values());
  const minRange = d3.min(projectCount) ?? 0; // TODO: meaningful fallback values
  const maxRange = d3.max(projectCount) ?? 10;

  const scale = d3
    .scaleLinear()
    .domain([minRange, maxRange])
    .range([minHeight, maxHeight]);

  const points: FeatureCollection<Point> = {
    type: "FeatureCollection",
    features: topojson
      .feature(neCountriesTopoJson, neCountriesTopoJson.objects.countries)
      .features.map((feature) => {
        const value = projectsCountry.get(feature.properties?.iso3code);
        const pointFeature: Feature<Point> = {
          type: "Feature",
          properties: {
            projectCount: value,
            ...feature.properties,
          },
          geometry: {
            type: "Point",
            coordinates: [
              d3.geoCentroid(feature)[0],
              d3.geoCentroid(feature)[1],
            ],
          },
        };
        return pointFeature;
      })
      .filter((feature) => feature.properties?.projectCount),
  };

  const polygons = {
    type: "FeatureCollection",
    features: topojson
      .feature(neCountriesTopoJson, neCountriesTopoJson.objects.countries)
      .features.filter((feature) => {
        const matchedCountry = areaCodes.find(
          (area) => area["ISO-alpha3 Code"] === feature.properties?.iso3code
        );
        const highlight = matchedCountry?.["Least Developed Countries (LDC)"];
        return highlight;
      }),
  };

  return (
    <>
      <Head>
        <title>ITC's Projects in Sub-Sahran Africa</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Heading Tag={Headings.H1}>
          ITC's projects in Sub-Saharan Africa
        </Heading>
        <svg width={mapOptions.bounds.width} height={mapOptions.bounds.height}>
          <defs>
            <PatternDots
              style={mapOptions.theme.choropleth?.pattern}
              angle={0}
            ></PatternDots>
          </defs>
          <BaseLayer
            data={neCountriesTopoJson}
            projection={mapOptions.projection}
            theme={mapOptions.theme}
            labels
          />
          <g className="choroplethLayer">
            {polygons.features.map((feature) => (
              <ChoroplethSymbol
                key={nanoid()}
                projection={mapOptions.projection}
                feature={feature}
                theme={mapOptions.theme}
              />
            ))}
          </g>
          <g className="symbolLayer">
            {points.features.map((feature) => {
              const xy = mapOptions.projection(
                feature.geometry.coordinates as [number, number]
              );
              return (
                xy && (
                  <IsoUnit
                    key={nanoid()}
                    xy={xy}
                    scale={scale}
                    value={feature.properties?.projectCount}
                    side={5}
                    style={{ ...mapOptions.theme.symbol, fillOpacity: 1 }}
                    label={true}
                  />
                )
              );
            })}
          </g>
        </svg>
      </main>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const projects = await getProjects();

  const projectSelection = projects.filter(
    (
      row
    ): row is Omit<Project, "dateStart" | "dateEnd" | "projectID"> & {
      dateStart: string;
      dateEnd: string;
      projectID: string;
    } => typeof row.dateStart === "string" && typeof row.dateEnd === "string"
  );

  projectSelection.sort((a, b) =>
    d3.ascending(new Date(a.dateStart), new Date(b.dateStart))
  );

  const areaCodes = await getUnsdCountries();
  const neCountriesTopoJson = await getCountries("50m");

  return {
    props: {
      projects: projectSelection,
      areaCodes,
      neCountriesTopoJson,
    },
  };
};

export default ProjectCountries;
