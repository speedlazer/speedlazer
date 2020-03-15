import s1p1 from "./stage1/part1.lazer";
import s1p2 from "./stage1/part2.lazer";
import s1p3 from "./stage1/part3.lazer";

const gameStructure = [
  { name: "stage1.intro", script: s1p1 },
  { name: "state1.mines", script: s1p2 },
  { name: "state1.battleship", script: s1p3 }
];

export default gameStructure;
