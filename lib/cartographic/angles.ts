export const toDegree = (radians: number) => {
  return (180 * radians) / Math.PI;
};

export const toRadians = (degree: number) => {
  return degree * (Math.PI / 180);
};
