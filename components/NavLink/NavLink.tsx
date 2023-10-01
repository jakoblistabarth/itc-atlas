/** @jsxImportSource theme-ui */

import { FC } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = React.PropsWithChildren<{
  href: string;
  disabled?: boolean;
}>;

const NavLink: FC<Props> = ({ href, children, disabled = false }) => {
  const { pathname } = useRouter();
  const isActive = pathname.startsWith(href);
  return (
    <Link
      href={href}
      onClick={disabled ? (e) => e.preventDefault() : undefined}
      sx={{
        variant: "styles.a",
        fontWeight: isActive ? "bold" : "regular",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {children}
    </Link>
  );
};

export default NavLink;
