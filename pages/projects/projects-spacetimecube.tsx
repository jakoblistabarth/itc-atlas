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

type Props = SharedPageProps & {
  projects: ProjectsWithCountries;
};

const ProjectSpaceTimeCube: NextPage<Props> = ({
  neCountriesTopoJson,
  projects,
  countries,
}) => {
  return (
    <PageBase title="Projects Space Time Cube">
      <Container>
        <Section>
          <SpaceTimeCubeProjects
            projects={projects}
            neCountriesTopoJson={neCountriesTopoJson}
            countries={countries}
          />
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

export default ProjectSpaceTimeCube;
