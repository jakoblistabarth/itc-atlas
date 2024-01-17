import { union } from "d3";
import { geoBertin1953 } from "d3-geo-projection";
import type { GetStaticProps, NextPage } from "next";
import { feature } from "topojson-client";
import Callout from "../../components/Callout";
import CanvasStage from "../../components/CanvasStage";
import Caption from "../../components/Caption";
import Container from "../../components/Container";
import DutchDevelopmentPolicies from "../../components/DutchDevelopmentPolicies";
import MapLayerBase from "../../components/MapLayerBase";
import MapLayout from "../../components/MapLayout";
import MapLayoutBody from "../../components/MapLayout/MapLayoutBody";
import MapLayoutHeader from "../../components/MapLayout/MapLayoutHeader";
import MarkGeometry from "../../components/MarkGeometry/MarkGeometry";
import PageBase from "../../components/PageBase/PageBase";
import Paragraph from "../../components/Paragraph";
import PrismMapPolicies from "../../components/PrismMapPolicies";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";
import getBhosCountries from "../../lib/data/getBhosCountries";
import getCountries from "../../lib/data/getCountries";
import getDutchCabinets from "../../lib/data/getDutchCabinets";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import { BhosCountry } from "../../types/BhosCountry";
import { DutchCabinet } from "../../types/DutchCabinet";
import { SharedPageProps } from "../../types/Props";
import BhosCountriesOverTime from "../../components/BhosCountriesOverTime";

type Props = {
  dutchCabinets: DutchCabinet[];
  bhosCountries: BhosCountry[];
} & SharedPageProps;

const Page: NextPage<Props> = ({
  neCountriesTopoJson,
  dutchCabinets,
  bhosCountries,
}) => {
  const cabinetsWithBhosData = Array.from(
    union(bhosCountries.map((d) => d.cabinet)),
  );

  const geometries = feature(
    neCountriesTopoJson,
    neCountriesTopoJson.objects.ne_admin_0_countries,
  );

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
            <h2 className="mt-5">Dutch development policy with Rutte IV</h2>
            <h3>2022–2023</h3>
            <DutchDevelopmentPolicies
              countries={neCountriesTopoJson}
              cabinet={"Rutte IV"}
              bhosCountries={bhosCountries}
            />
          </Section>

          <Section>
            <h2>Number of BHOS countries over time</h2>
            <BhosCountriesOverTime
              bhosCountries={bhosCountries}
              dutchCabinets={dutchCabinets}
            />
            <Caption reference="Fig.2">
              Number of countries in Dutch development policies per year.
            </Caption>
            <Paragraph>
              If all of this comes off as mixed-up to you, that&apos;s because
              it is! Quick: do you have a infinitely reconfigurable scheme for
              coping with emerging methodologies? Is it more important for
              something to be dynamic or to be customer-directed? What does the
              buzzword &quot;technologies&quot;
            </Paragraph>
          </Section>
          <Section>
            <h2> Occurences of countries in Dutch development policies</h2>
            <CanvasStage className="my-5 h-[350px]">
              <PrismMapPolicies
                topology={neCountriesTopoJson}
                bhosCountries={bhosCountries}
              />
            </CanvasStage>
            <Caption reference="Fig.3">
              Occurences of countries in Dutch development policies
            </Caption>
            <Callout title="Tipp">
              Hover over a country to see in how many years it was considered to
              be a focus country for development.
            </Callout>
            <Callout title="Methodology" className="bg-itc-blue-50">
              Only certain categories of focus countries are considered
              <details className="mt-3">
                <summary>Dutch development policies</summary>
                <Paragraph className="italic">
                  Explain which policies are considered and why?
                </Paragraph>
              </details>
              <details className="mt-3">
                <summary>Inconcistencies in cateogries</summary>
                <Paragraph className="italic">
                  Explain inconsistencies
                </Paragraph>
              </details>
            </Callout>
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
        </Container>
      </PageBase>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const neCountriesTopoJson = getCountries();
  const countries = await getCountryCodes();
  const bhosCountries = await getBhosCountries();
  const dutchCabinets = await getDutchCabinets();
  return {
    props: {
      neCountriesTopoJson,
      countries,
      bhosCountries,
      dutchCabinets,
    },
  };
};

export default Page;
