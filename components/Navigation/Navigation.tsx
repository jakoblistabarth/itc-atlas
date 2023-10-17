import { FC } from "react";
import { HiOutlineHome } from "react-icons/hi";
import NavLink from "../NavLink";
import BetaBadge from "../BetaBadge";
import Container from "../Container";
import Link from "../Link";

const Navigation: FC = () => {
  return (
    <Container>
      <nav className="flex items-stretch">
        <div className="mr-3 flex w-10 items-center justify-center rounded-md bg-white p-1">
          <Link href="/">
            <HiOutlineHome />
          </Link>
        </div>
        <div className="inline-flex gap-x-2 rounded-md bg-white p-1">
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
        </div>
        <div className="ml-5 flex items-center">
          <BetaBadge />
        </div>
      </nav>
    </Container>
  );
};

export default Navigation;
