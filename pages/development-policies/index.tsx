import * as d3 from "d3";
import { union } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import { feature } from "topojson-client";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayout from "../../components/MapLayout";
import MapLayoutBody from "../../components/MapLayout/MapLayoutBody";
import MapLayoutHeader from "../../components/MapLayout/MapLayoutHeader";
import MarkGeometry from "../../components/MarkGeometry/MarkGeometry";
import PageBase from "../../components/PageBase/PageBase";
import BhosGradientDefs from "../../components/visuals/BhosGradientsDefs";
import useBhosCategories from "../../components/visuals/useBhosCategories";
import getBhosCountries from "../../lib/data/getBhosCountries";
import getCountries from "../../lib/data/getCountries";
import getDutchCabinets from "../../lib/data/getDutchCabinets";
import getNfpCountries from "../../lib/data/getNfpCountries";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import { BhosCountry } from "../../types/BhosCountry";
import { DutchCabinet } from "../../types/DutchCabinet";
import { NfpCountry } from "../../types/NfpCountry";
import { SharedPageProps } from "../../types/Props";
import PoliciesPrismMap from "../../components/PoliciesPrismMap";
import MapLayoutFluid from "../../components/MapLayout/MapLayoutFluid";
import LegendNominal from "../../components/LegendNominal";
import Teaser from "../../components/Teaser";
import Paragraph from "../../components/Paragraph";
import Container from "../../components/Container";
import Section from "../../components/Section";
import CanvasStage from "../../components/CanvasStage";

type Props = {
  nfps: NfpCountry[];
  dutchCabinets: DutchCabinet[];
  bhosCountries: BhosCountry[];
} & SharedPageProps;

const NfpCountries: NextPage<Props> = ({
  nfps,
  neCountriesTopoJson,
  dutchCabinets,
  bhosCountries,
}) => {
  const width = 900;
  const margin = 20;
  const maxSize = 50;

  const yearDomain = d3.extent(
    nfps.map((nfp) => new Date(nfp.year.toString())),
  );
  const perYear = d3.group(nfps, (d) => d.year);
  const countDomain = d3.extent(
    [...Array.from(perYear.values())].map((countries) => countries.length),
  );

  const scale = d3
    .scaleSqrt()
    .domain([countDomain[0] ?? 0, countDomain[1] ?? 100])
    .range([3, maxSize / 2]);
  const scaleTime = d3
    .scaleTime()
    .domain([yearDomain[0] ?? new Date("1900"), yearDomain[1] ?? new Date()])
    .range([0, width - margin * 2 - maxSize * 2]);

  const selectedYears = [2000, 2005, 2009, 2013, 2022];
  const selection = selectedYears.map((y) => perYear.get(y));

  const cabinetsWithBhosData = Array.from(
    union(bhosCountries.map((d) => d.cabinet)),
  );

  const geometries = feature(
    neCountriesTopoJson,
    neCountriesTopoJson.objects.ne_admin_0_countries,
  );

  const {
    colorScale,
    bhosCountriesWithCategories,
    getCategoryKey,
    categoryCombinations,
  } = useBhosCategories(bhosCountries);

  return (
    <>
      <PageBase title="Development Policies">
        <Container>
          <Teaser>
            Insights into the moved history of Dutch development approaches in
            the last 70 years
          </Teaser>

          <Paragraph>
            A company that can incubate faithfully will (at some unspecified
            point in the future) be able to orchestrate correctly. If you
            productize globally, you may also reintermediate magnetically.
            Without development, you will lack experiences.
          </Paragraph>

          <Section>
            <h2 className="mt-5">Current Dutch development policy</h2>
            <h3>Rutte IV</h3>
            <MapLayoutFluid projection={geoBertin1953()}>
              <BhosGradientDefs
                categoryCombinations={categoryCombinations}
                getCategoryKey={getCategoryKey}
                colorScale={colorScale}
              />

              <MapLayerBase countries={neCountriesTopoJson} />
              <g>
                {geometries.features.map((f, idx) => {
                  const bhosCountry = bhosCountriesWithCategories.find(
                    (d) =>
                      d.isoAlpha3 === f.properties.ADM0_A3_NL &&
                      d.cabinet === "Rutte IV",
                  );
                  return (
                    <MarkGeometry
                      key={`${f.properties.ADM0_A3_NL}-${idx}`}
                      feature={f}
                      fill={
                        bhosCountry?.categories
                          ? `url(#${getCategoryKey(bhosCountry.categories)})`
                          : "transparent"
                      }
                      stroke="white"
                    />
                  );
                })}
              </g>
              <LegendNominal
                transform="translate(10 10)"
                entries={bhosCountries
                  .filter((d) => d.cabinet === "Rutte IV")
                  .reduce(
                    (acc: { label: string; color: string }[], { category }) => {
                      if (acc.map((d) => d.label).includes(category))
                        return acc;
                      return [
                        ...acc,
                        { label: category, color: colorScale(category) },
                      ];
                    },
                    [],
                  )}
              />
            </MapLayoutFluid>
          </Section>

          <Section>
            <h2>Number of focus countries over time</h2>
            <svg width={width} height={150}>
              <g transform={`translate(${margin}, ${margin})`}>
                {d3
                  .range(
                    yearDomain[0]?.getFullYear() ?? 0,
                    (yearDomain[1]?.getFullYear() ?? 0) + 1,
                    1,
                  )
                  .map((year) => {
                    const yearDate = new Date(year.toString());
                    const yearData = perYear.get(year);
                    return (
                      <g
                        key={year}
                        transform={`translate(${scaleTime(
                          yearDate,
                        )}, ${maxSize})`}
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

            <CanvasStage>
              <PoliciesPrismMap
                topology={neCountriesTopoJson}
                bhosCountries={bhosCountries}
              />
            </CanvasStage>
            <Paragraph>
              If all of this comes off as mixed-up to you, that&apos;s because
              it is! Quick: do you have a infinitely reconfigurable scheme for
              coping with emerging methodologies? Is it more important for
              something to be dynamic or to be customer-directed? What does the
              buzzword &quot;technologies&quot; really mean? Think granular.
              Without macro-vertical CAE, you will lack synergies. Imagine a
              combination of ActionScript and PHP. We pride ourselves not only
              on our robust feature set, but our vertical, customized efficient,
              user-centric TQM and non-complex use is usually considered an
              amazing achievement. A company that can incubate faithfully will
              (at some unspecified point in the future) be able to orchestrate
              correctly. If you productize globally, you may also reintermediate
              magnetically. Without development, you will lack experiences.
            </Paragraph>
          </Section>

          <Section>
            <h2>Focus countries of Dutch development policies</h2>
            <div className="grid grid-cols-4 gap-1">
              {dutchCabinets
                .filter((d) => cabinetsWithBhosData.includes(d.name))
                .map(({ name, dateStart, dateEnd }, idx) => {
                  const foucsCountries = geometries.features.filter((f) =>
                    bhosCountries
                      .filter((d) => d.category === "General Focus Country")
                      .filter((d) => d.cabinet === name)
                      .map((d) => d.isoAlpha3)
                      .includes(f.properties.ADM0_A3_NL),
                  );

                  const projection = geoBertin1953();
                  const bounds = {
                    width: 250,
                    height: 200,
                  };
                  return (
                    <MapLayout
                      key={idx}
                      bounds={bounds}
                      projection={projection}
                    >
                      <MapLayoutHeader>
                        <text dominantBaseline={"hanging"}>{name}</text>
                        <text
                          dominantBaseline={"hanging"}
                          fontSize={".5em"}
                          dy={"2em"}
                        >
                          {new Date(dateStart).getFullYear()}–
                          {new Date(dateEnd).getFullYear()}
                        </text>
                      </MapLayoutHeader>
                      <MapLayoutBody bounds={bounds}>
                        <MapLayerBase countries={neCountriesTopoJson} />
                        <g>
                          {foucsCountries.map((p, idx) => (
                            <MarkGeometry
                              key={`${p.properties.ADM0_A3_NL}-${idx}`}
                              feature={p}
                              fill={"teal"}
                            />
                          ))}
                        </g>
                      </MapLayoutBody>
                    </MapLayout>
                  );
                })}
            </div>
          </Section>

          <Section>
            <h2>NFP countries</h2>
            <Paragraph>
              NFP countries are Without preplanned cyber-Total Quality Control,
              aggregation are forced to become cross-media? We think that most
              C2C2C web-based applications use far too much Perl, and not enough
              OWL. Clicking on this link which refers to B2B Marketing awards
              shortlist will take you to the capacity to enable perfectly leads
              to the capacity to synthesize interactively. If all of this sounds
              astonishing to you.
            </Paragraph>
            <div className="mt-5 grid grid-cols-4 gap-4">
              {selection.map((selectedYear, idx) => {
                const nfpCountryCodes = selectedYear?.map((d) => d.countryISO);
                const foucsCountries = geometries.features.filter(
                  (f) => nfpCountryCodes?.includes(f.properties.ADM0_A3_NL),
                );

                const projection = geoBertin1953();
                const bounds = {
                  width: 250,
                  height: 200,
                };
                return (
                  <MapLayout key={idx} bounds={bounds} projection={projection}>
                    <MapLayoutHeader centered>
                      {selectedYear && (
                        <text dominantBaseline={"hanging"}>
                          {selectedYear[0]?.year.toString()}
                        </text>
                      )}
                    </MapLayoutHeader>
                    <MapLayoutBody bounds={bounds}>
                      <MapLayerBase countries={neCountriesTopoJson} />
                      <g>
                        {foucsCountries.map((p, idx) => (
                          <MarkGeometry
                            key={`${p.properties.ADM0_A3}-${idx}`}
                            feature={p}
                            style={{ fill: "teal" }}
                          />
                        ))}
                      </g>
                    </MapLayoutBody>
                  </MapLayout>
                );
              })}
            </div>
          </Section>
        </Container>
      </PageBase>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const nfps = await getNfpCountries();
  const neCountriesTopoJson = getCountries();
  const countries = await getCountryCodes();
  const bhosCountries = await getBhosCountries();
  const dutchCabinets = await getDutchCabinets();
  return {
    props: {
      nfps,
      neCountriesTopoJson,
      countries,
      bhosCountries,
      dutchCabinets,
    },
  };
};

export default NfpCountries;
