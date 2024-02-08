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
import { HiCursorClick } from "react-icons/hi";
import Image from "next/image";

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
      <PageBase title="Geographic focus">
        <Container>
          <Teaser>Focus countries</Teaser>

          <Paragraph>
            During the twentieth century traditional development cooperation was
            oriented to poverty reduction and rather broad in scope and
            geography. Pronk, Minister for Development Cooperation for more than
            fifteen years, was an important proponent of this approach.
          </Paragraph>
          <Paragraph>
            His successor, Herfkens started a process of reorientation of the
            policy resulting in an approach that let bilateral cooperation serve
            as a stimulant for broader societal processes of change. This period
            showed a variation in thematic as well as geographic focus. In the
            last decade the thematic focus was more consistent, but the
            geographic focus continues to shift, reflecting political choices.
          </Paragraph>
          <Paragraph>
            Development cooperation is seen as bilateral cooperation among
            stakeholders. From the Dutch side the national government works with
            societal partners such as NGO’s, knowledge institutions, and the
            private sector. Thematically it developed a focus on major global
            issues such as stability and security, knowledge development and
            migration policy.
          </Paragraph>
          <Paragraph>
            In 2022 the government renewed its perspective on focus countries.
            Counties specifically of interest for trade where added to the list.
            In addition a group of countries was added for whom both trade and
            development cooperation was relevant. Among the countries on the
            list for whom the relation was development cooperation only, a
            distinction as made between those with generic interest and those
            with a specific thematic focus [1]. Over time the definitions of
            what a focus country has change.
          </Paragraph>

          <Section>
            <h2 className="mt-5">
              Focus countries during the Rutte IV administration
            </h2>
            <figure>
              <h3>2022–2023</h3>
              <DutchDevelopmentPolicies
                countries={neCountriesTopoJson}
                cabinet={"Rutte IV"}
                bhosCountries={bhosCountries}
              />
            </figure>
            <Caption reference="Fig.1">
              Focus countries during the Rutte IV administration
            </Caption>
          </Section>

          <Section>
            <h2>Focus countries over time</h2>
            <Callout Icon={HiCursorClick}>
              Hover over a country to see in how many years it was considered to
              be a focus country for development.
            </Callout>
            <CanvasStage className="my-5 h-[350px]">
              <PrismMapPolicies
                topology={neCountriesTopoJson}
                bhosCountries={bhosCountries}
              />
            </CanvasStage>
            <Caption reference="Fig.2">
              Number of focus countries over time (countries more then 10 times:
              Bangladesh 15, Yemen and Kenya 12, Indonesia and Uganda 12, Mali,
              Egypte, Ethiopia and Tanzania 11.
            </Caption>
            <Callout title="Methodology" className="bg-itc-blue-50">
              Only certain categories of focus countries are considered
              <details className="mt-3">
                <summary>Dutch development policies</summary>
                <Paragraph className="italic">
                  Explain which policies are considered and why these are
                  considered.
                </Paragraph>
              </details>
              <details className="mt-3">
                <summary>Inconcistencies in cateogries</summary>
                <Paragraph className="italic">
                  Explain inconsistencies
                </Paragraph>
              </details>
            </Callout>
          </Section>

          <Section>
            <h2>Number of focus countries over time</h2>
            <figure className="my-5">
              <BhosCountriesOverTime
                bhosCountries={bhosCountries.filter(
                  (d) => d.category === "General Focus Country",
                )}
                dutchCabinets={dutchCabinets}
              />
              <Caption reference="Fig.3">
                Number of focus countries in the different administrations. Some
                numbers are missing because the cabinet periods were too short
                to develop policy or the data is unknown.
              </Caption>
            </figure>
          </Section>

          <Section>
            <h2>
              A geographic time series of focus countries during different
              administrations
            </h2>
            <figure className="my-5">
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
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
              <Caption reference="Fig.4">
                A geographic time series of the focus countries during the
                different administrations. Some are missing because the cabinet
                periods were to short to define policy or data were unknown (see
                also [page x; 1]).
              </Caption>
            </figure>
          </Section>
          <Section>
            <h2>Contradictions at the Ministry</h2>
            <figure>
              <h3>
                Of the 22 counties with a focus on development cooperation 9 are
                to be avoided (situation May 2023) because of a negative travel
                advise of the same authorities
              </h3>
              <Image
                className="my-10"
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/travel-contradiction-I.svg`}
                width={1600}
                height={900}
                alt={`Dutch government travel advices I`}
              />
              <Caption reference="Fig.5">
                Travel advise Dutch government (situation at 01-05-2023).
              </Caption>
              <Image
                className="my-10"
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/travel-contradictions-II.svg`}
                width={1600}
                height={900}
                alt={`Dutch government travel advices II`}
              />
              <Caption reference="Fig.6">
                Tension between focus countries and travel advise.
              </Caption>
            </figure>
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
