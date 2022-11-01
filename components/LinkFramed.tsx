import Link from "next/link";
import React, { FC } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import styles from "../styles/home.module.css";

type Props = React.PropsWithChildren<{
  href: string;
  description?: string;
}>;

const LinkFramed: FC<Props> = ({ href, description, children }) => {
  return (
    <Link href={href}>
      <a className={styles.card}>
        <h2>
          {children} <MdOutlineArrowRightAlt />
        </h2>
        {description && <p>{description}</p>}
      </a>
    </Link>
  );
};

export default LinkFramed;
