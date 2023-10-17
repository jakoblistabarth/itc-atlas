import type { NextPage } from "next";
import IndonesiaTimeline from "../../components/IndonesiaTimeline";
import PagePaperCanvas from "../../components/PagePaperCanvas";
import getCountries from "../../lib/data/getCountries";
import getDutchForeignAffairsMinisters from "../../lib/data/getDutchForeignAffairsMinisters";
import getITCNames from "../../lib/data/getITCNames";
import getLongTermMissions from "../../lib/data/getLongTermMissions";
import getPolicyTopics from "../../lib/data/getPolicyTopics";
import getProjectsIndonesia from "../../lib/data/getProjectsIndonesia";
import getApplicationsByYear, {
  ApplicationByYearWithCount,
} from "../../lib/data/queries/application/getApplicationsByYear";
import getBtorsByCountry, {
  BtorsByCountry,
} from "../../lib/data/queries/btors/getBTORsByCountry";
import getPhdsByYear, {
  PhdsByYearWithCount,
} from "../../lib/data/queries/phd/getPhdsByYear";
import { LongTermMission } from "../../types/LongTermMission";
import { Minister } from "../../types/Minister";
import { ProjectIndonesia } from "../../types/Project";
import AnnotationsPrint from "../../components/IndonesiaTimeline/AnnotationsPrint";

type Props = {
  applications: ApplicationByYearWithCount;
  btors: BtorsByCountry;
  longTermMissions: LongTermMission[];
  ministers: Minister[];
  itcNames: ReturnType<typeof getITCNames>;
  policyTopics: ReturnType<typeof getPolicyTopics>;
  phdsByYear: PhdsByYearWithCount;
  projects: ProjectIndonesia[];
};

const Page: NextPage<Props> = ({
  applications,
  btors,
  longTermMissions,
  ministers,
  itcNames,
  policyTopics,
  phdsByYear,
  projects,
}) => (
  <PagePaperCanvas title="Indonesia Timeline">
    <div style={{ width: 1280 }}>
      <IndonesiaTimeline
        applications={applications}
        btors={btors}
        longTermMissions={longTermMissions}
        ministers={ministers}
        itcNames={itcNames}
        policyTopics={policyTopics}
        phdsByYear={phdsByYear}
        projects={projects}
      >
        <AnnotationsPrint />
      </IndonesiaTimeline>
    </div>
  </PagePaperCanvas>
);

export async function getStaticProps() {
  const neCountriesTopoJson = getCountries();
  const itcNames = getITCNames();
  const policyTopics = getPolicyTopics();
  const [
    applications,
    btors,
    longTermMissions,
    projects,
    phdsByYear,
    ministers,
  ] = await Promise.all([
    getApplicationsByYear("IDN"),
    getBtorsByCountry("IDN"),
    getLongTermMissions(),
    getProjectsIndonesia(),
    getPhdsByYear("IDN"),
    getDutchForeignAffairsMinisters(),
  ]);
  return {
    props: {
      applications,
      btors,
      longTermMissions,
      projects,
      phdsByYear,
      ministers,
      itcNames,
      policyTopics,
      neCountriesTopoJson,
    },
  };
}

export default Page;
