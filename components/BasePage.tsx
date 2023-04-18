/** @jsxImportSource theme-ui */

import Footer from "./Footer";
import { Container, Heading } from "theme-ui";
import Seo from "./Seo";
import Header from "./Header";
import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
}>;

const BasePage: FC<Props> = ({ title, children }) => {
  return (
    <>
      <Seo title={title} />
      <Header />

      <Container>
        <main>
          <Heading as="h1">{title}</Heading>
          {children}
        </main>
      </Container>

      <Footer />
    </>
  );
};

export default BasePage;
