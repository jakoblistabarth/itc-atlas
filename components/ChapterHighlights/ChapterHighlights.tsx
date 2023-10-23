import { FC } from "react";
import { MdArrowForward } from "react-icons/md";
import Link from "../Link";

type Props = {
  highlights: { href: string; title: string }[];
};

const ChapterHighlights: FC<Props> = ({ highlights }) => (
  <div className="my-4 max-w-2xl rounded-sm bg-itc-green-50 p-3 dark:bg-itc-green-900">
    <h2>Highlights</h2>
    <ul className="list-none">
      {highlights.map(({ href, title }, i) => (
        <li className="mt-1" key={i}>
          <Link href={href}>
            <MdArrowForward className="mr-1 inline" /> {title}
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

export default ChapterHighlights;
