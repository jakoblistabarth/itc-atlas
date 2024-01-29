import Image from "next/image";
import { NextPage } from "next";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";
import Teaser from "../../components/Teaser";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import Caption from "../../components/Caption";

const AboutITC: NextPage = () => {
  return (
    <>
      <PageBase title="About ITC">
        <Container>
          <Teaser>
            Charting today&apos;s global challenges with the use of
            geo-information and earth observations.
          </Teaser>
          <Section>
            <Paragraph>
              ITC (International Training Centre for Aerial Survey), was founded
              in 1950 by then Prime Minister Schermerhorn of the Netherlands as
              the country&apos;s contribution to the United Nations Development
              Assistance Programme (UNDAP). Its activities focused on aerial
              photography and map making, with the goal of establishing analog
              and later digital topographic and geographic mapping systems for
              countries without a spatial infrastructure.
            </Paragraph>
            <Paragraph>
              In 2010 ITC became the faculty of Geo-Information Science and
              Earth Observation of the University of Twente.
            </Paragraph>
            <Paragraph>
              The world has changed since our founding over 70 years ago. We
              started out as local mapmakers. The knowledge, tools and network
              we developed along the way have turned us into global sense
              makers.
            </Paragraph>
          </Section>
          <Section>
            <h2>Mission and vision</h2>
            <Paragraph>
              Our mission is capacity development, where we apply, share and
              facilitate the effective use of geo-information and earth
              observation knowledge and tools for tackling wicked global
              problems. We aim to enable our many partners worldwide to track
              and trace the impact – and the shifting causes and frontiers – of
              today&apos;s global challenges. We are here to identify and
              understand vulnerability and use geospatial solutions to convert
              it into resilience, thereby contributing to the establishment of
              sustainable living environments anchored in an inclusive society.
            </Paragraph>
            <figure className="my-10 max-w-lg">
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/organigramm.png`}
                width={1600}
                height={900}
                alt={`ITC's organigramm`}
              />
              <Caption reference="Fig.1">
                ITC&apos;s primary processes and the Faculty&apos;s main themes
                where it wants to show it societal impact.
              </Caption>
            </figure>
            <Paragraph>
              Our vision is of a world in which researchers, educators, and
              students collaborate across disciplinary and geographic divides
              with governmental and non-governmental organisations, institutes,
              businesses, and local populations to surmount today&apos;s complex
              global challenges and contribute to sustainable, fair, and digital
              societies.
            </Paragraph>
          </Section>
          <Section>
            <h2 className="mt-5">Our home base</h2>
            <Paragraph>
              ITC has been reallocated several times during its history. The
              most prominent move was from Delft to Enschede in 1971. At that
              time the Dutch administration’s policy was to relocated different
              governmental institutions from the western part of the country to
              the north, east, and south to stimulated the economy in those
              parts. The most recent move was to the campus of the University of
              Twente in 2023.
            </Paragraph>
            <Image
              className="my-10 max-w-lg"
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/itc-moves.png`}
              width={1600}
              height={900}
              alt={`ITC's home base and moves within the Netherlands`}
            />
            <Caption reference="Fig.2">ITC moves in the last 70 years</Caption>
          </Section>
        </Container>
      </PageBase>
    </>
  );
};

export default AboutITC;
