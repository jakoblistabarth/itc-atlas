import { FC } from "react";
import * as Tooltip from "@radix-ui/react-tooltip";
import useSWR from "swr";
import getCountry from "../../lib/data/queries/country/getCountry";

type Props = {
  isoAlpha3Code: string;
};

const CountryCodeBadge: FC<Props> = ({ isoAlpha3Code }) => {
  const { isLoading, error, data } = useSWR<
    Awaited<ReturnType<typeof getCountry>>
  >(`/api/data/country/${isoAlpha3Code}`);
  return (
    <Tooltip.Provider>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span className="inline-block cursor-pointer rounded-md border px-2 py-1 text-xs">
            {isoAlpha3Code}
          </span>
        </Tooltip.Trigger>
        {}
        <Tooltip.Portal>
          <Tooltip.Content
            className="z-50 select-none rounded-[4px] bg-white px-[15px] py-[10px] text-[15px] leading-none text-itc-green shadow-[hsl(206_22%_7%_/_35%)_0px_10px_38px_-10px,_hsl(206_22%_7%_/_20%)_0px_10px_20px_-15px] will-change-[transform,opacity] data-[state=delayed-open]:data-[side=bottom]:animate-slideUpAndFade data-[state=delayed-open]:data-[side=left]:animate-slideRightAndFade data-[state=delayed-open]:data-[side=right]:animate-slideLeftAndFade data-[state=delayed-open]:data-[side=top]:animate-slideDownAndFade dark:bg-itc-green-800"
            sideOffset={5}
          >
            {isLoading && (
              <div className="bg-grey h-4 w-full animate-pulse rounded-sm" />
            )}
            {error && <span className="italic">No matched country</span>}
            {data && data.nameLongEn}
            <Tooltip.Arrow className="fill-white dark:fill-itc-green-800" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};

export default CountryCodeBadge;
