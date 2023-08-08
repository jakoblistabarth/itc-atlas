/** @jsxImportSource theme-ui */

import Footer from "./Footer";
import Seo from "./Seo";
import Header from "./Header";
import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  title: string;
}>;

const PaperCanvasPage: FC<Props> = ({ title, children }) => {
  return (
    <>
      <Seo title={title} />
      <div sx={{ background: "rgb(230,230,230)" }}>
        <Header />

        <main
          sx={{
            p: 3,
            minWidth: "100vw",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            sx={{
              background: "white",
              boxShadow: 1,
              p: 3,
              borderRadius: 1,
              pointerEvents: "none",
            }}
          >
            {children}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PaperCanvasPage;
