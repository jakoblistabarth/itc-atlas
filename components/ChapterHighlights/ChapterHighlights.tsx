/** @jsxImportSource theme-ui */

import { FC } from "react";
import { Box, Heading } from "theme-ui";
import { MdArrowForward } from "react-icons/md";
import Link from "../Link";

type Props = {
  highlights: { href: string; title: string }[];
};

const ChapterHighlights: FC<Props> = ({ highlights }) => (
  <Box
    sx={{
      p: 3,
      borderRadius: 2,
      my: 4,
      background: "muted",
    }}
  >
    <Heading as="h2">Highlights</Heading>
    <ul
      sx={{
        listStyleType: "none",
        pl: 0,
        li: { mt: 2, display: "flex", alignItems: "center" },
      }}
    >
      {highlights.map(({ href, title }, i) => (
        <li key={i}>
          <MdArrowForward sx={{ mr: 2 }} />
          <Link href={href}>{title}</Link>
        </li>
      ))}
    </ul>
  </Box>
);

export default ChapterHighlights;
