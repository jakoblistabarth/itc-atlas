import Footer from "../Footer";
import Seo from "../Seo";
import { FC, PropsWithChildren, ReactElement } from "react";
import Container from "../Container";
import Section from "../Section";
import Header from "../Header";

type Props = PropsWithChildren<{
  heroVisual: ReactElement;
  title: string;
}>;

const HeroVisualPage: FC<Props> = ({ title, heroVisual, children }) => {
  return (
    <>
      <Seo title={title} />
      <Header />

      <main>
        <div className="mt-10 px-4">{heroVisual}</div>
        <Container>
          <Section>
            <h1>{title}</h1>
          </Section>
          {children}
        </Container>
      </main>

      <Footer />
    </>
  );
};

export default HeroVisualPage;
