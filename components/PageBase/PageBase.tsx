/** @jsxImportSource theme-ui */

import Footer from "../Footer";
import { Box, Container, Heading } from "theme-ui";
import Seo from "../Seo";
import Header from "../Header";
import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
  renderTitle?: boolean;
}>;

const PageBase: FC<Props> = ({ title, renderTitle = true, children }) => {
  return (
    <>
      <Seo title={title} />
      <Header />

      <Container>
        <main>
          <Box variant="layout.section">
            {renderTitle && <Heading as="h1">{title}</Heading>}
          </Box>
          {children}
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default PageBase;
