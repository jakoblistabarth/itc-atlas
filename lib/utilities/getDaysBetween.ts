const getDaysBetween = (dateA: Date, dateB: Date) => {
  const difference = dateB.getTime() - dateA.getTime();
  return Math.ceil(difference / (1000 * 3600 * 24));
};

export default getDaysBetween;
