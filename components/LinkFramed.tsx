import Link from "next/link";
import React, { FC } from "react";
import { MdOutlineArrowRightAlt } from "react-icons/md";
import styles from "../styles/Home.module.css";

type Props = React.PropsWithChildren<{
  href: string;
  description?: string;
}>;

const LinkFramed: FC<Props> = ({ href, description, children }) => {
  return (
    <Link href={href}>
      <div className={styles.card}>
        <h2>
          {children} <MdOutlineArrowRightAlt />
        </h2>
        {description && <p>{description}</p>}
      </div>
    </Link>
  );
};

export default LinkFramed;
