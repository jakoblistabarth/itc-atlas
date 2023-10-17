import { PropsWithChildren, forwardRef } from "react";

type Props = PropsWithChildren;

const TourBeacon = forwardRef<HTMLButtonElement, Props>(function TourBeacon(
  { ...props },
  ref,
) {
  return (
    <button
      {...props}
      className="relative aspect-square h-[20px] w-[20px] cursor-pointer rounded-full bg-itc-blue font-serif font-bold italic leading-[20px] text-white shadow-md dark:bg-itc-green"
      ref={ref ?? undefined}
    >
      <span className="relative z-10">i</span>
      <span className="absolute left-0 inline-block h-[20px] w-[20px] animate-ping rounded-full bg-itc-blue" />
    </button>
  );
});

export default TourBeacon;
