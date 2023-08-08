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
      transform: scale(1.2);
    }
  `;
  return (
    <button
      {...props}
      sx={{
        cursor: "pointer",
        animation: `${pulse} 2s ease-in-out infinite`,
        width: 20,
        height: 20,
        background: "secondary",
        aspectRatio: "1",
        borderRadius: "100%",
        boxShadow: 1,
        border: "none",
        fontSize: 1,
        fontWeight: "bold",
        color: "white",
        fontFamily: "heading",
        fontStyle: "italic",
        padding: 0,
      }}
      ref={ref ?? undefined}
    >
      i
    </button>
  );
});

export default TourBeacon;
