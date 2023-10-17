import Footer from "../Footer";
import Seo from "../Seo";
import Header from "../Header";
import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
}>;

const PaperCanvasPage: FC<Props> = ({ title, children }) => {
  return (
    <>
      <Seo title={title} />
      <div className="bg-gray-100 pt-5">
        <Header />

        <main className="min-width-full mt-5 flex items-center justify-center">
          <div className="pointer-events-none rounded-md bg-white p-5 shadow-md">
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PaperCanvasPage;
