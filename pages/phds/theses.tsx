import { Department } from "@prisma/client";
import { scaleOrdinal } from "d3";
import type { GetStaticProps, NextPage } from "next";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase/PageBase";
import Paragraph from "../../components/Paragraph";
import PhdThesesBookChart from "../../components/PhdThesesBookChart";
import { groupThesesByYear } from "../../components/PhdThesesBookChart/PhdThesesBookChart.helpers";
import Section from "../../components/Section";
import Teaser from "../../components/Teaser";
import loadDepartments from "../../lib/data/load/loadDepartments";
import getPhdTheses, {
  PhdTheses,
} from "../../lib/data/queries/phd/getPhdTheses";

type Props = {
  phdTheses: PhdTheses;
  departments: Department[];
};

const Page: NextPage<Props> = ({ phdTheses, departments }) => {
  const thesesByYear = groupThesesByYear(phdTheses);

  const colorScale = scaleOrdinal<string, string, string>()
    .domain(departments.map((d) => d.id))
    .range([
      "yellow",
      "orange",
      "red",
      "purple",
      "cornflowerblue",
      "darkblue",
      "turquoise",
      "teal",
    ])
    .unknown("grey");

  return (
    <PageBase title="PhD at ITC">
      <Container>
        <Teaser>
          A PhD study at ITC is carried out in one of the six departments under
          the supervision of staff and promotor.
        </Teaser>
        <PhdThesesBookChart
          colorScale={colorScale}
          thesesByYear={thesesByYear}
        />
        <Section>
          <h2>PhD categories</h2>
          <Paragraph>
            There are on average over a hundred PhD candidates at ITC, including
            research staff positions (AIO-positions). Most PhD candidates are
            full-time at ITC, aiming to submit and defend a PhD thesis within a
            four-year research period. Others are PhD interns spending periods
            of several months to one year at ITC as part of their studies.
          </Paragraph>
          <h2 className="mt-5">Programme overview</h2>
          <Paragraph>
            The task of a PhD researcher includes research activities, attending
            training courses and some teaching and supervising activities. The
            research activities will provide the PhD candidate with the skills
            and experience they need to become an independent researcher. Part
            of the research also involves disseminating the knowledge acquired,
            for example, through publications in academic journals. During the
            4-year PhD programme the candidate must obtain at least 30 credits
            worth of PhD courses or hands-on activities. These cover academic
            skills and career development, in depth disciplinary and
            wide-ranging courses. An integral part of a PhD is writing the PhD
            thesis and then, of course, presenting and defend the research in
            public. After successfully completing the PhD, you will be awarded
            the title of Doctor.
          </Paragraph>
        </Section>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [phdTheses, departments] = await Promise.all([
    getPhdTheses(),
    loadDepartments(),
  ]);

  return {
    props: {
      phdTheses,
      departments,
    },
  };
};

export default Page;
