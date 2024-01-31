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
      <PageBase title="M.Sc. courses">
        <Container>
          <main>
            <Teaser>ITC is involved in several MSc courses</Teaser>
            <Paragraph>
              The of the five MSc course the MSc Geo-information Science and
              Earth Observation is IC oldest course which has evolved since the
              start of ITC seventy years ago. The diagram [1] gives an overview
              of this evolution into today&apos;s program. Programs haver to
              change regularly to keep up to date with technological development
              and societal needs.
            </Paragraph>
            <Paragraph>
              Another in-house MSc&apos;s is Spatial Engineering. Geographical
              Information Management and applications is a joint degree with the
              Dutch universities of Delft, Utrecht and Wageningen. In the
              European context ITC is partner in two Erasmus plus MSc programs.
              These are the joint degree Cartography with Universities of
              Dresden, München, and Vienna, and Geo-information science and
              earth observation for environmental modelling and management, with
              the universities of Louvain, Lund, and Tartu.
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
