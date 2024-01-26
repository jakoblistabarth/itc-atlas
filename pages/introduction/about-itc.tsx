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
          <Teaser>Insights into the history of ITC in the last 70 years</Teaser>
          <Paragraph>
            A company that can incubate faithfully will (at some unspecified
            point in the future) be able to orchestrate correctly. If you
            productize globally, you may also reintermediate magnetically.
            Without development, you will lack experiences.
          </Paragraph>

          <Section>
            <h2 className="mt-5">ITC&apos;s moves</h2>
            <Paragraph>
              A company that can incubate faithfully will (at some unspecified
              point in the future) be able to orchestrate correctly. If you
              productize globally, you may also reintermediate magnetically.
              Without development, you will lack experiences.
            </Paragraph>
            <Image
              className="my-10 max-w-lg"
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/itc-moves.png`}
              width={1600}
              height={900}
              alt={`ITC-moves`}
            />
            <Caption reference="Fig.1">ITC moves in the last 70 years</Caption>
          </Section>

          <Section>
            <h2 className="mt-5">How is ITC organized?</h2>
            <Paragraph>
              A company that can incubate faithfully will (at some unspecified
              point in the future) be able to orchestrate correctly. If you
              productize globally, you may also reintermediate magnetically.
              Without development, you will lack experiences.
            </Paragraph>
            <Image
              className="my-10 max-w-lg"
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/organigramm.png`}
              width={1600}
              height={900}
              alt={`organigramm`}
            />
            <Caption reference="Fig.2">Organigramm</Caption>
          </Section>

          <Section>
            <h2 className="mt-5">Levels of capacity development</h2>
            <Paragraph>
              A company that can incubate faithfully will (at some unspecified
              point in the future) be able to orchestrate correctly. If you
              productize globally, you may also reintermediate magnetically.
              Without development, you will lack experiences.
            </Paragraph>
            <Image
              className="my-10 max-w-lg"
              src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/levels-of-capacity-development.png`}
              width={1600}
              height={900}
              alt={`Capacity-development`}
            />
            <Caption reference="Fig.3">Levels of capacity development</Caption>
          </Section>
        </Container>
      </PageBase>
    </>
  );
};

export default AboutITC;
