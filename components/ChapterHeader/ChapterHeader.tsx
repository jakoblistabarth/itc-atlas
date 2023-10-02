/** @jsxImportSource theme-ui */

import { FC } from "react";
import { Box, Text } from "theme-ui";
import Header from "../Header";

type Props = {
  chapterName: string;
};

const ChapterHeader: FC<Props> = ({ chapterName }) => (
  <Box
    sx={{
      background: "primary",
    }}
  >
    <Header />
    <Box
      sx={{
        py: 6,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Text
        sx={{
          fontFamily: "Fraunces Variable",
          fontStyle: "italic",
          color: "background",
          fontSize: [2, 7],
        }}
      >
        {chapterName}
      </Text>
    </Box>
  </Box>
);

export default ChapterHeader;
