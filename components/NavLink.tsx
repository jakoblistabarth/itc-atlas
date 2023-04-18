/** @jsxImportSource theme-ui */

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = React.PropsWithChildren<{
  href: string;
  description?: string;
}>;

const NavLink: FC<Props> = ({ href, children }) => {
  const { pathname } = useRouter();
  const isActive = pathname.startsWith(href);
  return (
    <Link
      href={href}
      sx={{ variant: "styles.a", fontWeight: isActive ? "bold" : "regular" }}
    >
      {children}
    </Link>
  );
};

export default NavLink;
