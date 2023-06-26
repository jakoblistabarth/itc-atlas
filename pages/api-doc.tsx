import { GetStaticProps, InferGetStaticPropsType } from "next";
import { createSwaggerSpec } from "next-swagger-doc";
import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic(import("swagger-ui-react"), { ssr: false });

type Props = InferGetStaticPropsType<typeof getStaticProps>;

const ApiDoc: NextPage<Props> = ({ spec }) => <SwaggerUI spec={spec} />;
  return <SwaggerUI spec={spec} />;
}

export const getStaticProps: GetStaticProps = async () => {
  const spec = createSwaggerSpec({
    apiFolder: "pages/api/maps"
    definition: {
      openapi: "3.1.0",
      info: {
        title: "ITC Atlas API Documentation",
        version: "1.0",
      },
    },
  });

  return {
    props: {
      spec,
    },
  };
};

export default ApiDoc;
