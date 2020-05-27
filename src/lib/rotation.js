export const flipRotation = x => (x < 0 ? -180 : 180) - x;
export const rad = deg => (deg / 180) * Math.PI;

const cache = {};

export const normVector = angle => {
  if (cache[angle]) return cache[angle];

  const rads = Crafty.math.degToRad(angle);
  const nCos = Math.cos(rads);
  const nSin = Math.sin(rads);
  const normVector = { x: nCos, y: nSin };
  cache[angle] = normVector;
  return normVector;
};

export const rotX = (ent, length) => {
  const vec = normVector(ent.rotation);
  return [vec.x * length, vec.y * length];
};
export const rotY = (ent, length) => {
  const vec = normVector(ent.rotation + 90);
  return [vec.x * length, vec.y * length];
};
