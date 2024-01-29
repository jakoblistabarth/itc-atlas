import { RxCheck, RxChevronDown, RxChevronUp, RxReset } from "react-icons/rx";
import * as RSelect from "@radix-ui/react-select";
import { FC, ReactNode } from "react";

type Props = {
  label: string;
  options: string[];
  activeValue?: string;
  initialValue?: string;
  onChangeHandler: (value?: string) => void;
  optionLabels?: ReactNode[];
  withReset?: boolean;
  placeholder?: string;
};

const Select: FC<Props> = ({
  label,
  options,
  initialValue,
  activeValue,
  onChangeHandler,
  optionLabels,
  withReset = false,
  placeholder,
}) => {
  return (
    <label className="my-5 flex items-center gap-3">
      {label}
      <RSelect.Root
        key={activeValue}
        value={activeValue}
        onValueChange={(value) => {
          const department = options.find((d) => d === value);
          if (department) onChangeHandler(value);
        }}
      >
        <RSelect.Trigger className="inline-flex h-[35px] items-center justify-center gap-[5px] rounded bg-white px-[15px] leading-none shadow-[0_2px_10px] shadow-itc-blue/20 outline-none hover:bg-gray-50 focus:shadow-[0_0_0_2px] focus:shadow-black data-[placeholder]:text-gray-400">
          <RSelect.Value placeholder={placeholder} />
          <RSelect.Icon>
            <RxChevronDown />
          </RSelect.Icon>
        </RSelect.Trigger>
        <RSelect.Portal>
          <RSelect.Content className="overflow-hidden rounded-md bg-white shadow-[0px_10px_38px_-10px_rgba(22,_23,_24,_0.35),0px_10px_20px_-15px_rgba(22,_23,_24,_0.2)]">
            <RSelect.ScrollUpButton className="flex h-[25px] cursor-default items-center justify-center bg-white">
              <RxChevronUp />
            </RSelect.ScrollUpButton>
            <RSelect.Viewport className="p-[5px]">
              {options.map((value, idx) => {
                return !value ? (
                  <></>
                ) : (
                  <RSelect.Item
                    key={value}
                    value={value}
                    className="relative flex h-[25px] select-none items-center rounded-[3px] pl-[25px] pr-[35px] leading-none data-[disabled]:pointer-events-none data-[highlighted]:bg-itc-green-50 data-[disabled]:text-white data-[highlighted]:text-itc-green  data-[highlighted]:outline-none"
                  >
                    <RSelect.ItemText>
                      {optionLabels ? optionLabels[idx] : value}
                    </RSelect.ItemText>
                    <RSelect.ItemIndicator className="absolute right-0 inline-flex w-[25px] items-center justify-center">
                      <RxCheck />
                    </RSelect.ItemIndicator>
                  </RSelect.Item>
                );
              })}
            </RSelect.Viewport>
            <RSelect.ScrollDownButton className="flex h-[25px] cursor-default items-center justify-center bg-white">
              <RxChevronDown />
            </RSelect.ScrollDownButton>
          </RSelect.Content>
        </RSelect.Portal>
      </RSelect.Root>
      {withReset && (
        <button
          disabled={!activeValue}
          onClick={() => onChangeHandler(initialValue)}
          className="flex items-center gap-2 rounded p-1 px-2 shadow-sm transition-shadow hover:bg-gray-100 disabled:cursor-not-allowed disabled:hover:bg-inherit"
        >
          <RxReset /> Reset
        </button>
      )}
    </label>
  );
};

export default Select;
