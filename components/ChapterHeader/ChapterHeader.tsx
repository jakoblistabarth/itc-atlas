import { FC } from "react";
import Header from "../Header";
import ChapterIcon from "../ChapterIcon";
import { isChapter } from "../../types/Chapter";

type Props = {
  chapterName: string;
  icon?: boolean;
};

const ChapterHeader: FC<Props> = ({ chapterName, icon = true }) => {
  return (
    <div className="relative overflow-hidden bg-itc-green">
      {icon && (
        <div className="left-o pointer-events-none absolute top-0">
          <ChapterIcon
            width={"40vw"}
            height={"40vw"}
            className="mix-blend-screen invert"
            opacity={0.1}
            chapter={isChapter(chapterName) ? chapterName : undefined}
          />
        </div>
      )}
      <Header />
      <div className="flex flex-col items-center py-10 md:py-32">
        <div className="font-serif text-xl italic text-white md:text-7xl">
          {chapterName}
        </div>
      </div>
    </div>
  );
};

export default ChapterHeader;
