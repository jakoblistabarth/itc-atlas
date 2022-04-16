import React, { FC } from "react";
import { fDateMonthYear } from "../lib/utilities/formaters";
import styles from "../styles/home.module.css";

const Footer: FC = () => {
  return (
    <footer className={styles.footer}>{fDateMonthYear(new Date())}</footer>
  );
};

export default Footer;
