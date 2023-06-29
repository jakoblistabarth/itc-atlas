import { FC, PropsWithChildren } from "react";
import { Box } from "theme-ui";

type Props = PropsWithChildren<{
  reference?: string;
}>;

const Caption: FC<Props> = ({ reference, children }) => {
  return (
    <Box sx={{ fontSize: 1, my: 3 }}>
      {reference && (
        <>
          <strong>{reference}</strong>{" "}
        </>
      )}
      <span>{children}</span>
    </Box>
  );
};

export default Caption;
