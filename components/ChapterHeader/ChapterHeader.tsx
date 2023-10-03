/** @jsxImportSource theme-ui */

import { FC } from "react";
import { Box, Text } from "theme-ui";
import Header from "../Header";
import ChapterIcon from "../ChapterIcon";
import { isChapter } from "../../types/Chapter";

type Props = {
  chapterName: string;
  icon?: boolean;
};

const ChapterHeader: FC<Props> = ({ chapterName, icon = true }) => {
  return (
    <Box
      sx={{
        background: "primary",
      }}
    >
      {icon && (
        <Box
          sx={{ top: 0, left: 0, position: "absolute", pointerEvents: "none" }}
        >
          <ChapterIcon
            width={"40vw"}
            height={"40vw"}
            sx={{
              filter: "invert(1)",
              mixBlendMode: "screen",
            }}
            opacity={0.1}
            chapter={isChapter(chapterName) ? chapterName : undefined}
          />
        </Box>
      )}
      <Header />
      <Box
        sx={{
          py: [4, 6],
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
            fontSize: [5, 7],
          }}
        >
          {chapterName}
        </Text>
      </Box>
    </Box>
  );
};

export default ChapterHeader;
