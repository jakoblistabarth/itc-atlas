import { FC, useMemo } from "react";
import { chapters as chapterNames } from "../../types/Chapter";
import { Card } from "../Card";
import Image from "next/image";
import Link from "../Link";
import ChapterIcon from "../ChapterIcon";

const ChapterNavigationWithImages: FC = () => {
  const chapters = useMemo(() => {
    return chapterNames
      .filter((d) => d !== "Appendix")
      .map((chapter) => ({
        chapter,
        slug: chapter.toLowerCase().replaceAll(" ", "-"),
        disabled: chapter === "Appendix" ? true : false,
      }));
  }, []);

  return (
    <div className="mt-5 grid grid-cols-[repeat(auto-fill,_minmax(300px,_1fr))] gap-5">
      {chapters.map(({ chapter, slug }) => (
        <Card key={chapter}>
          <Image
            src={`${process.env.NEXT_PUBLIC_SITE_URL}/images/tile-${slug}.png`}
            width={1600}
            height={960}
            alt={`Preview chapter ${chapter}`}
          />
          <Card.Body>
            <h3 className="flex items-center gap-2 text-xl">
              <ChapterIcon width={"1em"} height={"1em"} chapter={chapter} />{" "}
              {chapter}
            </h3>
          </Card.Body>
          <Card.Footer>
            <Link href={`/${slug}`}>more</Link>
          </Card.Footer>
        </Card>
      ))}
    </div>
  );
};

export default ChapterNavigationWithImages;
