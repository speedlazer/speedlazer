import s1p1 from "./stage1/intro.lazer";
import s1p2 from "./stage1/hacked.lazer";
import s1p3 from "./stage1/battleship.lazer";
import end from "./end.lazer";

const gameStructure = [
  { name: "stage1.intro", script: s1p1, tags: { campaign: true } },
  { name: "stage1.hacked", script: s1p2, tags: { campaign: true } },
  {
    name: "stage1.battleship",
    script: s1p3,
    tags: { campaign: true, wip: true }
  },
  { name: "end", script: end, tags: { campaign: true } }
];

export default gameStructure;
