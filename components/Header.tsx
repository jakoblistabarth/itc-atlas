/** @jsxImportSource theme-ui */

import { FC } from "react";
import { Container } from "theme-ui";
import { HiOutlineHome } from "react-icons/hi";
import NavLink from "./NavLink";

const Header: FC = () => {
  return (
    <header>
      <Container sx={{ pt: 4 }}>
        <nav
          sx={{
            display: "flex",
            gap: 3,
            a: {
              p: 2,
              borderRadius: 2,
              background: "background",
              transition: "box-shadow .5s",
              "&:hover": {
                boxShadow: "0 0 10px rgba(0,0,0,.25)",
              },
            },
          }}
        >
          <NavLink href="/">
            <HiOutlineHome />
          </NavLink>
          <NavLink href="/introduction">Introduction</NavLink>
          <NavLink href="/education">Education</NavLink>
          <NavLink href="/research">Research</NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <NavLink href="/appendix">Appendix</NavLink>
        </nav>
      </Container>
    </header>
  );
};

export default Header;
