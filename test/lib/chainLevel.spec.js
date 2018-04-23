import {
  determineLevel,
  levelInfo,
  levelProgress
} from "../../src/lib/chainLevel";
import { expect } from "chai";

const cumulativeLevelInfo = level => {
  let info = levelInfo(level);
  if (!info) return null;
  const result = {
    xp: 0,
    reward: 0,
    ratio: 0,
    name: info.name
  };
  for (let index = level; index >= 1; index--) {
    let info = levelInfo(index);
    if (!info) return null;
    result.xp += info.xp;
    result.reward += info.reward;
  }
  result.ratio = result.reward / result.xp;
  return result;
};

describe("Chain scoring", () => {
  describe("determineLevel", () => {
    it("reports which chain level the users is on based on XP", () => {
      const xpForOne = levelInfo(1).xp;
      const xpForTwo = levelInfo(2).xp;

      expect(determineLevel(xpForOne - 1)).to.eql(0);
      expect(determineLevel(xpForOne)).to.eql(1);
      expect(determineLevel(xpForOne + xpForTwo - 1)).to.eql(1);
      expect(determineLevel(xpForOne + xpForTwo)).to.eql(2);
    });
  });

  describe("level progress", () => {
    it("shows the progress for the first level", () => {
      const firstLevelXP = levelInfo(1).xp;
      const fiftyPercentXP = firstLevelXP / 2;

      expect(levelProgress(fiftyPercentXP)).to.eql(0.5);
    });

    it("shows the progress for the second level", () => {
      const firstLevelXP = levelInfo(1).xp;
      const secondLevelXP = levelInfo(2).xp;
      const seventyFivePercentXP = firstLevelXP + secondLevelXP * 0.75;

      expect(levelProgress(seventyFivePercentXP)).to.eql(0.75);
    });
  });

  describe("reward scaling", () => {
    it("is always interesting to reach the next level", () => {
      let level = 1;
      let nextLevel = cumulativeLevelInfo(level + 1);

      while (nextLevel) {
        for (let checkAgainst = level; checkAgainst >= 1; checkAgainst--) {
          let currentLevel = cumulativeLevelInfo(checkAgainst);
          let amount = Math.floor(nextLevel.xp / currentLevel.xp);
          let sumReward = currentLevel.reward * amount;
          expect(
            sumReward,
            `${nextLevel.name} awards less than achieving ${
              currentLevel.name
            } x ${amount}`
          ).to.be.lessThan(nextLevel.reward);
          expect(
            nextLevel.ratio,
            `${nextLevel.name} score ratio is too high`
          ).to.be.lessThan(currentLevel.ratio * 1.4);
          //console.log(`${nextLevel.name}: ${nextLevel.reward} vs. ${currentLevel.name} x ${amount}: ${sumReward}`);
          //console.log(`${nextLevel.name}: ${nextLevel.ratio} vs. ${currentLevel.name}: ${currentLevel.ratio}`);
        }

        level++;
        nextLevel = cumulativeLevelInfo(level + 1);
      }
    });
  });
});
