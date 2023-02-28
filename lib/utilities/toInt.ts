const toInt = (svgProp: string | number | undefined) => {
  if (!svgProp) return;
  if (typeof svgProp === "string") return parseInt(svgProp);
  return svgProp;
};

export default toInt;
