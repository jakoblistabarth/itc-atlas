/** @jsxImportSource theme-ui */

import type { NextPage } from "next";
import { Box, Container, Heading, Paragraph } from "theme-ui";
import PageBase from "../../components/PageBase";
import Link from "next/link";
import Callout from "../../components/Callout";
import { BiBug } from "react-icons/bi";

const Page: NextPage = () => {
  return (
    <PageBase title="ITC Atlas – beta version">
      <Container>
        <main>
          <Box as="section" variant="layout.section">
            <Paragraph variant="text.teaser">
              We&apos;re working on an online atlas for ITC. The website
              you&apos;re looking at right now is still in beta.
            </Paragraph>
            <Heading as="h2">What does the beta phase mean for you?</Heading>
            <Callout Icon={BiBug}>Watch out for bugs!</Callout>
            <Paragraph>
              Generally, that means that the website itself and its maps,
              visuals and the texts are not final. Please expect to encounter
              preliminary content and bugs. In particular, it means that maps,
              visuals and even entire pages might be renamed, modified or even
              disappear completely as we incrementally move forward to the final
              product.
            </Paragraph>

            <Heading as="h2">What does the beta phase mean for us?</Heading>
            <Paragraph>
              Well, obviously a lot of work on our table. We are busy improving
              the individual components used on this website (see the{" "}
              <Link href={"https://component-library-itc-atlas.netlify.app/"}>
                component library
              </Link>
              ) and compiling maps and visualizations. We&apos;re updating this
              publicly available instance frequently as we go.
            </Paragraph>

            <Heading as="h2">Why this atlas?</Heading>
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
          </Box>
        </main>
      </Container>
    </PageBase>
  );
};

export default Page;
