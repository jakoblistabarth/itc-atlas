/** @jsxImportSource theme-ui */

import { FC } from "react";
import { Box, Container } from "theme-ui";
import { HiOutlineHome } from "react-icons/hi";
import NavLink from "../NavLink";

const Navigation: FC = () => {
  return (
    <Container sx={{ pt: 4 }}>
      <nav
        sx={{
          display: "flex",
          a: {
            p: 2,
            transition: "background .2s",
            borderRadius: 2,
            "&:hover": {
              background: "muted",
            },
          },
        }}
      >
        <div
          sx={{
            background: "background",
            display: "flex",
            alignItems: "center",
            borderRadius: 2,
            mr: 3,
            px: 1,
          }}
        >
          <NavLink href="/">
            <HiOutlineHome />
          </NavLink>
        </div>
        <Box
          sx={{
            display: "inline-flex",
            gap: 3,
            borderRadius: 2,
            background: "background",
            p: 1,
          }}
        >
          <NavLink href="/introduction">Introduction</NavLink>
          <NavLink disabled href="/education">
            Education
          </NavLink>
          <NavLink disabled href="/research">
            Research
          </NavLink>
          <NavLink href="/projects">Projects</NavLink>
          <NavLink disabled href="/appendix">
            Appendix
          </NavLink>
        </Box>
      </nav>
    </Container>
  );
};

export default Navigation;
