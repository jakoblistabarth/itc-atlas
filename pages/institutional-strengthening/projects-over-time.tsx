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
import Caption from "../../components/Caption";
import Link from "next/link";
import Paragraph from "../../components/Paragraph";

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
          <Paragraph>
            The Space-Time Cube allows one to see both the spatial and temporal
            component of the data. The map on the bottom of the cube represents
            space and the vertical axe time. The cloud of spheres yet again
            gives a different perspective on the data (see
            <Link href={"/institutional-strengthening/projects-by-country"}>
              [1] and [2]
            </Link>
            ). The size of the sphere represents the number of projects in a
            particular year. Selecting a country will show it on the map and
            both the sphere and the graph show the temporal distribution of the
            projects.
          </Paragraph>
          <SpaceTimeCubeProjects
            projects={projects}
            neCountriesTopoJson={neCountriesTopoJson}
            countries={countries}
          />
          <Caption reference="Fig.1">
            Space-time cube representation of ITC project per country since 1990
          </Caption>
        </Section>
        <Section>
          <h2>Timeline</h2>
          <h3>
            The traditional timeline not only shows the temporal distribution of
            the over thousand projects executed but also their duration
          </h3>
          <ProjectsTimeline projects={projects} />
          <Caption reference="Fig.2">
            Timeline of ITC and their duration
          </Caption>
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
