import { FC, PropsWithChildren } from "react";

type Props = PropsWithChildren<{
  reference?: string;
}>;

const Caption: FC<Props> = ({ reference, children }) => {
  return (
    <div className="my-3 max-w-2xl text-xs">
      {reference && (
        <>
          <strong>{reference}</strong>{" "}
        </>
      )}
      <span>{children}</span>
    </div>
  );
};

export default Caption;
