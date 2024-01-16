import Footer from "../Footer";
import Seo from "../Seo";
import { FC, PropsWithChildren } from "react";
import Container from "../Container";
import { Chapter } from "../../types/Chapter";
import ChapterHeader from "../ChapterHeader";
import ChapterNavigation from "../ChapterNavigation";
import Paragraph from "../Paragraph";

type Props = PropsWithChildren<{
  chapterName: Chapter;
}>;

const PageChapter: FC<Props> = ({ chapterName, children }) => {
  return (
    <>
      <Seo title={`Chapter ${chapterName}`} />
      <ChapterHeader chapterName={chapterName} />

      <Container>
        <main>{children}</main>
      </Container>

      <div className="mb-0 mt-40 bg-itc-green-50 py-32 dark:bg-itc-green-900">
        <Container>
          <h2>Explore more on ITC!</h2>
          <Paragraph>
            The following chapters provide even more information on different
            aspects of ITC&apos;s efforts towards capcity building.
          </Paragraph>
          <ChapterNavigation />
        </Container>
      </div>

      <Footer />
    </>
  );
};

export default PageChapter;
