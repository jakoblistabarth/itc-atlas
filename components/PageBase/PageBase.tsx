import Footer from "../Footer";
import Seo from "../Seo";
import Header from "../Header";
import { FC, PropsWithChildren } from "react";
import Container from "../Container";

type Props = PropsWithChildren<{
  title: string;
  renderTitle?: boolean;
}>;

const PageBase: FC<Props> = ({ title, renderTitle = true, children }) => {
  return (
    <>
      <Seo title={title} />
      <Header />

      <main>
        <Container>
          {renderTitle && <h1 className="mt-10">{title}</h1>}
        </Container>
        {children}
      </main>

      <Footer />
    </>
  );
};

export default PageBase;
