export const flipRotation = x => (x < 0 ? -180 : 180) - x;
export const rad = deg => (deg / 180) * Math.PI;

export const rotX = (ent, length) => {
  const rotation = rad(ent.rotation);
  return [Math.cos(rotation) * length, Math.sin(rotation) * length];
};
export const rotY = (ent, length) => {
  const rotation = rad(ent.rotation + 90);
  return [Math.cos(rotation) * length, Math.sin(rotation) * length];
};
