const sliceIntoChunks = (array: object[] | any[], chunkSize: number) => {
  const res = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    const chunk = array.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
};

export default sliceIntoChunks;
