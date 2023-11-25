import s1p1 from "./stage1/intro.lazer";
import s1p2 from "./stage1/hacked.lazer";
import s1p3 from "./stage1/battleship.lazer";
import s1p3b from "./stage1/battleship-end.lazer";
import s1p4 from "./stage1/bay.lazer";
import s1p5 from "./stage1/bridge.lazer";
import t1 from "./test/scenery.lazer";
import t2 from "./test/lasertest.lazer";
import t3 from "./test/composable.lazer";
import end from "./end.lazer";

const gameStructure = [
  { name: "stage1.intro", script: s1p1, tags: { campaign: true } },
  { name: "stage1.hacked", script: s1p2, tags: { campaign: true } },
  {
    name: "stage1.battleship",
    script: s1p3,
    tags: { campaign: true }
  },
  {
    name: "stage1.battleshipEnd",
    script: s1p3b,
    tags: { campaign: true }
  },
  {
    name: "stage1.bay",
    script: s1p4,
    tags: { campaign: true }
  },
  {
    name: "stage1.bridge",
    script: s1p5,
    tags: { campaign: true, wip: true }
  },
  { name: "end", script: end, tags: { campaign: true } },
  { name: "test.scenery", script: t1, tags: { test: true } },
  { name: "test.laser", script: t2, tags: { test: true } },
  { name: "test.composable", script: t3, tags: { test: true } }
];

export default gameStructure;
