import React, { FC } from "react";
import { fDateMonthYear } from "../lib/utilities/formaters";
import styles from "../styles/home.module.css";
import BackToHome from "./BackToHome";

type Props = React.PropsWithChildren<{}>;

const Footer: FC<Props> = ({ children }) => {
  return (
    <footer className={styles.footer}>
      {children}
      <BackToHome />
      <div style={{ marginTop: "2em" }}>{fDateMonthYear(new Date())}</div>
    </footer>
  );
};

export default Footer;
