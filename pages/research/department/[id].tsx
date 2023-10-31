import { GetStaticPaths, GetStaticProps, NextPage } from "next";
import getDepartments from "../../../lib/data/queries/departments/getDepartments";
import prisma from "../../../prisma/client";
import PageBase from "../../../components/PageBase";
import { Department } from "@prisma/client";
import Container from "../../../components/Container";
import Section from "../../../components/Section";
import { ParsedUrlQuery } from "querystring";

type Props = {
  department: Department;
};

const Page: NextPage<Props> = ({ department }) => {
  return (
    <PageBase title={`Department ${department.id}`}>
      <Container>
        <Section>This is the beginning of the department page.</Section>
      </Container>
    </PageBase>
  );
};

export default Page;

export const getStaticPaths: GetStaticPaths<Params> = (async () => {
  const departments = await getDepartments(true);
  const paths = departments.map(({ id }) => ({
    params: {
      id,
    },
  }));
  return { paths, fallback: false };
}) satisfies GetStaticPaths;

interface Params extends ParsedUrlQuery {
  id: string;
}

export const getStaticProps: GetStaticProps<Props, Params> = (async (
  context,
) => {
  //@ts-expect-error: wrong typing of parsedqueryurl context
  const { id } = context.params;
  const department = await prisma.department.findFirstOrThrow({
    where: {
      id: {
        equals: id,
      },
    },
  });
  return { props: { department } };
}) satisfies GetStaticProps<Props>;
