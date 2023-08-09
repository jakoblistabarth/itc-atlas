/** @jsxImportSource theme-ui */

import Footer from "../Footer";
import { Container, Heading } from "theme-ui";
import Seo from "../Seo";
import { FC, PropsWithChildren, ReactElement } from "react";
import Navigation from "../Navigation";

type Props = PropsWithChildren<{
  heroVisual: ReactElement;
  title: string;
}>;

const HeroVisualPage: FC<Props> = ({ title, heroVisual, children }) => {
  return (
    <>
      <Seo title={title} />
      <Navigation />

      <main>
        <Container sx={{ width: "100%", maxWidth: "none", px: 4 }}>
          {heroVisual}
        </Container>
        <Container>
          <Heading as="h1">{title}</Heading>
          {children}
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default HeroVisualPage;
