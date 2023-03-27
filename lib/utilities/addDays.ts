const addDays = (date: Date, n: number) => {
  const newDate = new Date(date.valueOf());
  newDate.setDate(newDate.getDate() + n);
  return newDate;
};

export default addDays;
