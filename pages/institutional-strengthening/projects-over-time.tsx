import type { GetStaticProps, NextPage } from "next";
import Container from "../../components/Container";
import PageBase from "../../components/PageBase";
import Section from "../../components/Section";
import SpaceTimeCubeProjects from "../../components/SpaceTimeCubeProjects";
import getCountries from "../../lib/data/getCountries";
import getCountryCodes from "../../lib/data/queries/country/getCountryCodes";
import getProjectsWithCountries, {
  ProjectsWithCountries,
} from "../../lib/data/queries/project/getProjectsWithCountries";
import { SharedPageProps } from "../../types/Props";
import ProjectsTimeline from "../../components/ProjectsTimeline";

type Props = SharedPageProps & {
  projects: ProjectsWithCountries;
};

const ProjectsOverTime: NextPage<Props> = ({
  neCountriesTopoJson,
  projects,
  countries,
}) => {
  return (
    <PageBase title="Projects over time">
      <Container>
        <Section>
          <h2>Space time cube</h2>
          <SpaceTimeCubeProjects
            projects={projects}
            neCountriesTopoJson={neCountriesTopoJson}
            countries={countries}
          />
        </Section>
        <Section>
          <h2>Timeline</h2>
          <ProjectsTimeline projects={projects} />
        </Section>
      </Container>
    </PageBase>
  );
};

export const getStaticProps: GetStaticProps<Props> = async () => {
  const [projects, countries, neCountriesTopoJson] = await Promise.all([
    getProjectsWithCountries(),
    getCountryCodes(),
    getCountries(),
  ]);

  return {
    props: {
      neCountriesTopoJson,
      projects,
      countries,
    },
  };
};

export default ProjectsOverTime;
