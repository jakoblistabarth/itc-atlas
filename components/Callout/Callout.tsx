/** @jsxImportSource theme-ui */

import { ComponentType, FC, PropsWithChildren } from "react";
import { MdOutlineLightbulb } from "react-icons/md";
import { Box, Grid, Text } from "theme-ui";

type Props = PropsWithChildren<{
  title?: string;
  Icon?: ComponentType;
}>;

const Callout: FC<Props> = ({ Icon = MdOutlineLightbulb, title, children }) => (
  <Box
    sx={{
      background: "muted",
      p: 3,
      my: 2,
      borderRadius: 2,
      fontSize: 1,
      maxWidth: "600px",
    }}
  >
    <Grid gap={3} columns={"min-content auto"}>
      <Icon />
      <Box>
        {title && <Text as="h4">{title}</Text>}
        {children}
      </Box>
    </Grid>
  </Box>
);

export default Callout;
