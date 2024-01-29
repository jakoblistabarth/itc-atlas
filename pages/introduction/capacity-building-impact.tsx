import Image from "next/image";
import { NextPage } from "next";
import PageBase from "../../components/PageBase";
import Container from "../../components/Container";
import Teaser from "../../components/Teaser";
import Paragraph from "../../components/Paragraph";
import Section from "../../components/Section";
import Caption from "../../components/Caption";
import Link from "next/link";
import ImpactBox from "../../public/images/impact-box.svg";

const AboutITC: NextPage = () => {
  return (
    <>
      <PageBase title="Capacity building and impact">
        <Container>
          <Teaser>Realizing ITC&apos;s vision</Teaser>
          <Section>
            <h2>Capacity Development</h2>
            <Paragraph>
              ITC does capacity development via our three primary processes:
              education, research and {/* TODO: add inline link component? */}
              <Link href={"/institutional-strengthening"}>
                institutional strengthening
              </Link>
              . However, the perspective on capacity development has changed
              over time. Seventy years ago it was seen mainly as training and
              educating individuals. Today, it not only involves activities
              which affect capabilities of individuals, but also organisations
              and the institutional context within which they operate [1]. The
              activities should focus particular on countries that receive
              official development assistance (ODA), and as such expect to
              contribute to the international policy agenda of the different
              dutch Ministries, such as foreign trade and development
              cooperation (BHOS). This also in an international context of
              considering the 17 Sustainable Development Goals (SDGs) to protect
              the planet and deal with social, economic and environmental
              challenges, the Paris Agreement of the United Nations Framework
              Convention on Climate Change (UNFCCC), and the Sendai Framework
              for Disaster Risk Reduction. Because activities are (at least in
              part) financed with means that are earmarked for ODA-related work,
              the relevance of the activities needs to be justified.
            </Paragraph>
            <figure className="my-10 max-w-lg">
              <Image
                src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/levels-of-capacity-development.png`}
                width={1600}
                height={900}
                alt={`Capacity-development`}
              />
              <Caption reference="Fig.1">
                The different levels of capacity development and examples of
                most important activities.
              </Caption>
            </figure>
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
            <h2>Impact</h2>
            <Paragraph>
              ITC generates impact in diverse ways, moving research and
              knowledge frontiers, contributing to qualified professionals
              through teaching students, and empowering institutes and others to
              make better-informed decisions through purposely sharing knowledge
              with society.
            </Paragraph>
            <Paragraph>
              However, different types of impact can be distinguished. In the
              atlas academic impact, and societal and economic impact are used.
              Academic impact is realised via knowledge creation and
              dissemination. Societal and economic is realised via knowledge
              exploitation and utilisation.
            </Paragraph>
            <Paragraph>
              Academic impact is the proof that excellent research results in
              academic advances like understanding, method, theory and
              application across and within disciplines. Societal impact is the
              proof of what excellent research brings to society, economy, to
              benefit individuals, organisations and institutions. This type of
              impact type is further subdivided in categories culture
              (people&apos;s understanding of ideas and reality, values and
              beliefs), economic (a company&apos;s revenues and profits (micro
              level), and economic returns through increased productivity or
              economic growth (macro level)), educational (education, training
              and capacity-building, including through curricula, educational
              tools, and qualifications), environmental (managing and protecting
              the environment) , health (public health, life expectancy,
              health-related quality of life, prevention of illness, and reduced
              health inequality), political (how policymakers act, to how
              policies are constructed, and to political stability), social
              (community welfare and quality of life, and to behaviours,
              practices, and activities of people and groups), and technological
              (the creation or improvement of products, processes and services).
              The scheme in [2] gives a few examples and is used in the sections
              Institutional Strengthening to demonstrate the impact of selected
              ITC projects.
            </Paragraph>
            <Paragraph>
              Impact is not, by default, positive or present. Systematic
              reflection on risks (negative impact on society and staff) with
              honesty and transparency are needed to increase positive societal
              impact in the future. Perspectives change over time. In executing
              our primary processes, and cooperating with our global networks
              ITC staff used to fly all over the world as illustrated in the
              maps on page xxx. These travels depicted look embarrassing with
              today&apos;s view on the CO2 footprint in mind.
            </Paragraph>
            <figure className="my-7">
              <ImpactBox />
              <Caption reference="Fig.2">
                Impact indicatior to ‘measure’ different types of impact of
                projects (see{" "}
                <Link href={"/institutional-strengehtning"}>
                  Institutional Strengthening
                </Link>
                ).
              </Caption>
            </figure>
            <Paragraph>
              The Atlas attempts to visualize ITC&apos;s impact, to justify and
              show its Capacity Development mandate to its stakeholders. It
              showcases the evidence of the long-term achievements of our
              activities in research, education and institutional strengthening.
              This is especially elaborated in the institutional strengthening
              section of the atlas. It should provide input for reflection and
              learning from ongoing/past initiatives to generate a stronger
              impact in the future.
            </Paragraph>
            <Paragraph>
              Impact can not directly be influenced via our primary processes.
              We can only control needs (staff and facilities), activities
              (field work, experiments), and output (scientific publication,
              software). We might have a direct influence over outcome
              (citations, media coverage), but only an indirect influence on the
              consequences of people using the outcomes (the impact!). This
              chain of events is called the impact journey and based on the
              theory of change. An ‘reconstructed’ example is found in the
              Naivaisha project [page x].
            </Paragraph>
          </Section>
        </Container>
      </PageBase>
    </>
  );
};

export default AboutITC;
