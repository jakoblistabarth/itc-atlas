import type { NextPage } from "next";
import PageBase from "../../components/PageBase";
import Link from "next/link";
import Callout from "../../components/Callout";
import { BiBug } from "react-icons/bi";
import Container from "../../components/Container";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";
import Paragraph from "../../components/Paragraph";

const Page: NextPage = () => {
  return (
    <PageBase title="ITC Atlas – beta version">
      <Container>
        <main>
          <Section>
            <Teaser>
              We&apos;re working on an online atlas for ITC. The website
              you&apos;re looking at right now is still in beta.
            </Teaser>
            <h2>What does the beta phase mean for you?</h2>
            <Callout Icon={BiBug}>Watch out for bugs!</Callout>
            <Paragraph>
              Generally, that means that the website itself and its maps,
              visuals and the texts are not final. Please expect to encounter
              preliminary content and bugs. In particular, it means that maps,
              visuals and even entire pages might be renamed, modified or even
              disappear completely as we incrementally move forward to the final
              product.
            </Paragraph>

            <h2>What does the beta phase mean for us?</h2>
            <Paragraph>
              Well, obviously a lot of work on our table. We are busy improving
              the individual components used on this website (see the{" "}
              <Link href={"https://component-library-itc-atlas.netlify.app/"}>
                component library
              </Link>
              ) and compiling maps and visualizations. We&apos;re updating this
              publicly available instance frequently as we go.
            </Paragraph>

            <h2>Why this atlas?</h2>
            <Paragraph>
              ITC&apos;s mission is capacity development. We apply, share and
              facilitate the effective use of geo-information and earth
              observation knowledge and tools for tackling global wicked
              problems. Our activities in education and research are applied in
              our knowledge domains of Disaster Resilience, Resource Security,
              Geohealth, and Geo-Ai.
            </Paragraph>
            <Paragraph>
              The atlas will contribute to the impact narrative of ITC. It will
              demonstrate to a wide audience the impact of our capacity
              development interventions in education, research and institutional
              strengthening. The maps and diagrams express the geographic and
              thematic distribution of our activities over time. Its relevance
              is shown in context of national and international development
              agendas. The graphics assist to identify and analyse the best
              practices and lessons learned to be applied in future activities.
            </Paragraph>
          </Section>
        </main>
      </Container>
    </PageBase>
  );
};

export default Page;
