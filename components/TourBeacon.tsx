/** @jsxImportSource theme-ui */

import { keyframes } from "@emotion/react";
import { PropsWithChildren, forwardRef } from "react";

type Props = PropsWithChildren;

const TourBeacon = forwardRef<HTMLButtonElement, Props>(function TourBeacon(
  { ...props },
  ref
) {
  const pulse = keyframes`
    0% {
      transform: scale(1);
    }
    55% {
      transform: scale(2);
    }
  `;
  return (
    <button
      {...props}
      sx={{
        cursor: "pointer",
        animation: `${pulse} 1.5s ease-in-out infinite`,
        width: 7,
        height: 7,
        background: "secondary",
        aspectRatio: "1",
        borderRadius: "100%",
        border: "none",
        padding: 0,
      }}
      ref={ref ?? undefined}
    ></button>
  );
});

export default TourBeacon;
