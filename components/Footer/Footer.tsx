/** @jsxImportSource theme-ui */

import React, { FC } from "react";
import { fDateMonthYear } from "../../lib/utilities/formaters";
import BackToHome from "../BackToHome";

type Props = React.PropsWithChildren;

const Footer: FC<Props> = ({ children }) => {
  return (
    <footer
      sx={{
        display: "flex",
        flexFlow: "column wrap",
        justifyContent: "center",
        alignItems: "center",
        rowGap: 2,
        py: 5,
      }}
    >
      {children}
      <BackToHome />
      <div>{fDateMonthYear(new Date())}</div>
    </footer>
  );
};

export default Footer;
