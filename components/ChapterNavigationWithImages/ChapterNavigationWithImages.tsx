import { FC, useMemo } from "react";
import { Chapter, chapters as chapterNames } from "../../types/Chapter";
import { Card } from "../Card";
import Image, { StaticImageData } from "next/image";
import Link from "../Link";
import tileIntroduction from "../../public/images/tile-introduction.jpg";
import tileResearch from "../../public/images/tile-research.jpg";
import tileEducation from "../../public/images/tile-education.jpg";
import tileProjects from "../../public/images/tile-projects.jpg";
import ChapterIcon from "../ChapterIcon";

const ChapterNavigationWithImages: FC = () => {
  const chapters = useMemo(() => {
    const tiles = new Map<Chapter, StaticImageData>([
      ["Introduction", tileIntroduction],
      ["Education", tileEducation],
      ["Projects", tileProjects],
      ["Research", tileResearch],
    ]);

    const isImage = (
      maybeIsImage: StaticImageData | undefined,
    ): maybeIsImage is StaticImageData => maybeIsImage !== undefined;

    return chapterNames
      .filter((d) => d !== "Appendix")
      .map((chapter) => ({
        chapter,
        slug: chapter.toLowerCase(),
        tile: tiles.get(chapter),
        disabled: chapter === "Appendix" ? true : false,
      }))
      .filter((d) => isImage(d.tile));
  }, []);

  return (
    <div className="mt-5 grid grid-cols-[repeat(auto-fill,_minmax(320px,_1fr))] gap-5">
      {chapters.map(({ chapter, tile, slug }) => (
        <Card key={chapter}>
          {/* @ts-expect-error filtering with type predicate does not work */}
          <Image src={tile} alt={`Preview chapter ${chapter}`} />
          <Card.Body>
            <h3 className="flex items-center gap-2">
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
