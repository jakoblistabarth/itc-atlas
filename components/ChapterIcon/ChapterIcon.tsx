import { FC, SVGProps } from "react";
import IconResearch from "../../public/images/icon_research.svg";
import IconEducation from "../../public/images/icon_education.svg";
import IconProjects from "../../public/images/icon_projects.svg";
import IconIntroduction from "../../public/images/icon_introduction.svg";
import IconAppendix from "../../public/images/icon_appendix.svg";
import { Chapter } from "../../types/Chapter";

type Props = {
  chapter?: Chapter;
} & SVGProps<SVGElement>;

const ChapterIcon: FC<Props> = ({ chapter, ...rest }) => {
  switch (chapter) {
    case "Research":
      return <IconResearch {...rest} />;
    case "Education":
      return <IconEducation {...rest} />;
    case "Projects":
      return <IconProjects {...rest} />;
    case "Introduction":
      return <IconIntroduction {...rest} />;
    case "Appendix":
      return <IconAppendix {...rest} />;
    default:
      return <IconIntroduction {...rest} />;
  }
};

export default ChapterIcon;
