const colorCache = {};

export const convertColor = str => {
  const cache = colorCache[str];
  if (cache) return cache;
  const color = {};
  Crafty.assignColor(str, color);
  const result = {
    _red: color._red / 255,
    _green: color._green / 255,
    _blue: color._blue / 255
  };
  colorCache[str] = result;
  return result;
};
