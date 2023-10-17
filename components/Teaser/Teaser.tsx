import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren;

const Teaser: FC<Props> = ({ children }) => (
  <p className="my-2 max-w-4xl font-serif text-3xl font-thin italic">
    {children}
  </p>
);

export default Teaser;
