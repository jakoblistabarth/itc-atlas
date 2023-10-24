import { group, scaleOrdinal } from "d3";
import type { GetStaticProps, NextPage } from "next";
import PageBase from "../../components/PageBase/PageBase";
import PhdThesesBookChart from "../../components/PhdThesesBookChart";
import getPhdTheses, {
  PhdTheses,
} from "../../lib/data/queries/phd/getPhdTheses";
import { Department } from "@prisma/client";
import getDepartments from "../../lib/data/load/loadDepartments";
import LegendNominal from "../../components/LegendNominal";
import Container from "../../components/Container";

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
    <PageBase title="Phd theses">
      <Container>
        <PhdThesesBookChart
          colorScale={colorScale}
          thesesByYear={thesesByYear}
        />
        <svg height={400}>
          <LegendNominal
            transform="translate(0, 0) scale(2)"
            title="Departments"
            entries={colorScale
              .domain()
              .map((d) => ({ label: d, color: colorScale(d) }))}
          />
        </svg>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [phdTheses, departments] = await Promise.all([
    getPhdTheses(),
    getDepartments(),
  ]);

  return {
    props: {
      phdTheses,
      departments,
    },
  };
};

export default Page;
