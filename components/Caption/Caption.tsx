import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  reference?: string;
}>;

const Caption: FC<Props> = ({ reference, children }) => {
  return (
    <figcaption className="my-3 max-w-[60ch] text-xs">
      {reference && (
        <>
          <strong>{reference}</strong>{" "}
        </>
      )}
      <span>{children}</span>
    </figcaption>
  );
};

export default Caption;
