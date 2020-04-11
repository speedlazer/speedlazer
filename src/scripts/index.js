import s1p1 from "./stage1/intro.lazer";
import s1p2 from "./stage1/hacked.lazer";
import s1p3 from "./stage1/part3.lazer";
import s1p4 from "./stage1/part4.lazer";

const gameStructure = [
  { name: "stage1.intro", script: s1p1 },
  { name: "stage1.hacked", script: s1p2 },
  { name: "stage1.mines", script: s1p3 },
  { name: "stage1.battleship", script: s1p4 }
];

export default gameStructure;
