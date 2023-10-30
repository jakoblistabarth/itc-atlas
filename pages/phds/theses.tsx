import { group, scaleOrdinal } from "d3";
import type { GetStaticProps, NextPage } from "next";
import PageBase from "../../components/PageBase/PageBase";
import PhdThesesBookChart from "../../components/PhdThesesBookChart";
import getPhdTheses, {
  PhdTheses,
} from "../../lib/data/queries/phd/getPhdTheses";
import { Department } from "@prisma/client";
import loadDepartments from "../../lib/data/load/loadDepartments";
import Container from "../../components/Container";
import Paragraph from "../../components/Paragraph";
import Teaser from "../../components/Teaser";

type Props = {
  phdTheses: PhdTheses;
  departments: Department[];
};

const isNumber = (item: number | undefined | null): item is number => {
  return !!item;
};

const Page: NextPage<Props> = ({ phdTheses, departments }) => {
  const thesesByYear = group(
    phdTheses.filter((d) => isNumber(d.promotionYear)),
    (d) => d.promotionYear as number,
  );

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
          A PhD study at ITC is carried out in one of the six research themes
          under the supervision of staff and promotor. A PhD study may be
          initiated on the basis of a proposal submitted by the PhD candidate as
          part of the registration procedure.
        </Teaser>
        <PhdThesesBookChart
          colorScale={colorScale}
          thesesByYear={thesesByYear}
        />
        <h2>PhD categories</h2>
        <Paragraph>
          There are approximately 140 PhD candidates at ITC, including research
          staff positions (AIO-positions). Most PhD candidates are full-time at
          ITC, aiming to submit and defend a PhD thesis within a four-year
          research period. Others are PhD interns spending periods of several
          months to one year at ITC as part of their studies.
        </Paragraph>
        <h2 className="mt-5">Programme overview</h2>
        <Paragraph>
          Your tasks as a PhD researcher include research activities, attending
          training courses and teaching and supervising activities (in principle
          only for employees). Your research activities will provide you with
          the skills and experience you need to become an independent
          researcher. Part of your research also involves disseminating the
          knowledge you acquire, for example, through publications in academic
          journals. During the 4-year PhD programme you do at least 30 credits
          worth of PhD courses or hands-on activities. These cover academic
          skills and career development, in depth disciplinary and wide-ranging
          courses. An integral part of a PhD is writing your PhD thesis and
          then, of course, presenting and defend your research in public. After
          successfully completing your PhD, you will be awarded the title of
          Doctor (Dr., equivalent to PhD).
        </Paragraph>
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
