const isNumber = (item: number | undefined | null): item is number => {
  return !!item;
};

export default isNumber;
