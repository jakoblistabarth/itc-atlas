import { FC, HTMLAttributes, useMemo } from "react";
import CardLink from "../CardLink";
import Section from "../Section";
import ChapterIcon from "../ChapterIcon";
import { Chapter, chapters as chapterNames } from "../../types/Chapter";

type Props = HTMLAttributes<HTMLDivElement> & {
  title?: string;
};

const ChapterNavigation: FC<Props> = ({ title, ...props }) => {
  const chapters = useMemo(
    () =>
      chapterNames.map((chapter) => ({
        chapter,
        slug: chapter.toLowerCase(),
        disabled: chapter === "Appendix" ? true : false,
      })) satisfies { chapter: Chapter; slug: string; disabled?: boolean }[],
    [],
  );
  return (
    <Section {...props}>
      {title && <h2>{title}</h2>}
      <div className="mb-4 mt-2 grid max-w-4xl grid-cols-[repeat(auto-fill,_minmax(240px,_1fr))] gap-3">
        {chapters.map((d) => (
          <CardLink key={d.chapter} href={`/${d.slug}`} disabled={d.disabled}>
            <ChapterIcon
              chapter={d.chapter}
              width={"2em"}
              height={"2em"}
              opacity={0.2}
              className="mix-blend-multiply dark:mix-blend-screen dark:invert"
            />
            <h3>{d.chapter}</h3>
          </CardLink>
        ))}
      </div>
    </Section>
  );
};

export default ChapterNavigation;
