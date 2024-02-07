import type { GetStaticProps, NextPage } from "next";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase";
import Paragraph from "../../components/Paragraph";
import getCourseGenealogy from "../../lib/data/getCourseGenealogy";
import { CourseGenealogy as Genealogy } from "../../types/CourseGenealogy";
import CourseGenealogy from "../../components/CourseGenealogy";
import Caption from "../../components/Caption";
import Teaser from "../../components/Teaser";

type Props = {
  courseGenealogy: Genealogy;
};

const CourseGenealogyPage: NextPage<Props> = ({ courseGenealogy }) => {
  return (
    <>
      <PageBase title="MSc Courses">
        <Container>
          <main>
            <Teaser>ITC is involved in several MSc courses</Teaser>
            <Paragraph>
              The MSc Geo-information Science and Earth Observation is the
              Faculty&apos;s oldest course which has evolved since the start of
              ITC seventy years ago. The diagram [Fig 1] gives an overview of
              the evolution of this program. Programs have to change regularly
              to keep up to date with technological development and societal
              needs.
            </Paragraph>
            <Paragraph>
              Another in-house MSc is Spatial Engineering. The MSc Geographical
              Information Management and Applications (GIMA) is a joint degree
              with the Dutch universities of Delft, Utrecht and Wageningen. In
              the European context ITC is partner in two Erasmus plus MSc
              programs. These are the joint degree Cartography, with
              Universities of Dresden, München, and Vienna, and Geo-information
              science and earth observation for environmental modelling and
              management, with the universities of Louvain, Lund, and Tartu.
            </Paragraph>
            <figure className="my-5">
              <CourseGenealogy genealogy={courseGenealogy} />
              <Caption reference={"Fig.1"}>
                Course Genealogy of the current MSc Geoinformation Science and
                Earth Observation: Graduates of M.Sc. courses over time
              </Caption>
            </figure>
          </main>
        </Container>
      </PageBase>
    </>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const courseGenealogy = await getCourseGenealogy();
  return {
    props: {
      courseGenealogy,
    },
  };
};

export default CourseGenealogyPage;
