import * as Toolbar from "@radix-ui/react-toolbar";
import { FC, useCallback } from "react";
import {} from "react-icons/hi";
import {
  HiArrowLeft,
  HiArrowLongLeft,
  HiArrowLongRight,
  HiArrowRight,
  HiXMark,
} from "react-icons/hi2";
import { twMerge } from "tailwind-merge";
import { Card } from "../Card";

type Props = {
  minDate: Date;
  maxDate: Date;
  currentDate?: Date;
  setDate: (Date: Date | undefined) => void;
};

const TimelineControl: FC<Props> = ({
  minDate,
  maxDate,
  currentDate,
  setDate,
}) => {
  const setNewDate = useCallback(
    (step: number) => {
      const date = currentDate ?? minDate;
      const newDate = date.getFullYear() + step;
      return setDate(
        newDate < minDate.getFullYear()
          ? new Date(minDate.toString())
          : newDate > maxDate.getFullYear()
          ? new Date(maxDate.toString())
          : new Date(newDate.toString()),
      );
    },
    [currentDate, minDate, maxDate, setDate],
  );
  return (
    <Card className="mb-2">
      <Card.Body>
        <Toolbar.Root className="pointer-events-auto flex gap-1">
          <Toolbar.Button
            className="rounded-sm bg-itc-green-50 p-3 hover:bg-itc-green-200"
            onClick={() => setNewDate(-5)}
          >
            <HiArrowLongLeft />
          </Toolbar.Button>
          <Toolbar.Button
            className="rounded-sm bg-itc-green-50 p-3 hover:bg-itc-green-200"
            onClick={() => setNewDate(-1)}
          >
            <HiArrowLeft />
          </Toolbar.Button>
          <div
            className={twMerge(
              "flex-grow rounded-sm bg-gray-100 p-2 px-4 text-center",
              !currentDate && "text-gray-300",
            )}
          >
            {currentDate?.getFullYear() ?? "-"}
          </div>
          <Toolbar.Button
            className="rounded-sm bg-itc-green-50 p-3 hover:bg-itc-green-200"
            onClick={() => setNewDate(1)}
          >
            <HiArrowRight />
          </Toolbar.Button>
          <Toolbar.Button
            className="rounded-sm bg-itc-green-50 p-3 hover:bg-itc-green-200"
            onClick={() => setNewDate(5)}
          >
            <HiArrowLongRight />
          </Toolbar.Button>
          <Toolbar.Separator className="mx-3 w-[1px] bg-itc-green-100" />
          <Toolbar.Button
            className="rounded-sm bg-itc-green-50 p-3 hover:bg-itc-green-200"
            onClick={() => setDate(undefined)}
          >
            <HiXMark />
          </Toolbar.Button>
        </Toolbar.Root>
      </Card.Body>
    </Card>
  );
};

export default TimelineControl;
