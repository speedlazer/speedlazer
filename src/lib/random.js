let index = null;
const lookupTable = [];

for (index = 1e6; index--; ) {
  lookupTable.push(Math.random());
}
export const lookup = () =>
  ++index >= lookupTable.length ? lookupTable[(index = 0)] : lookupTable[index];
