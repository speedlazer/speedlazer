export const levels = [
  {
    xp: 200,
    reward: 100,
    name: "Nice"
  },
  {
    xp: 700,
    reward: 500,
    name: "Good"
  },
  {
    xp: 1400,
    reward: 1000,
    name: "Great"
  },
  {
    xp: 3000,
    reward: 2000,
    name: "Excellent"
  },
  {
    xp: 7000,
    reward: 5000,
    name: "Wondeful"
  },
  {
    xp: 15000,
    reward: 10000,
    name: "Superb"
  },
  {
    xp: 30000,
    reward: 20000,
    name: "Godlike"
  },
  {
    xp: 55000,
    reward: 40000,
    name: "Funky"
  },
  {
    xp: 115000,
    reward: 80000,
    name: "Fantastic"
  },
  {
    xp: 145000,
    reward: 100000,
    name: "Amazing"
  }
];

/*
 * NICE.........+100
 * GOOD.........+500
 * GREAT........+1.000
 * EXCELLENT....+2.000
 * WONDERFUL....+5.000
 * SUPERB.......+10.000
 * GODLIKE......+20.000
 * FUNKY........+40.000
 * FANTASTIC....+80.000
 * AMAZING(?)...+100.000
 */

export const determineLevel = xp => {
  let processXP = xp;
  for (let index = 0; index < levels.length; index++) {
    const levelData = levels[index];
    if (processXP < levelData.xp) return index;
    processXP -= levelData.xp;
  }
  return levels.length - 1;
};

export const levelProgress = xp => {
  let processXP = xp;
  for (let index = 0; index < levels.length; index++) {
    const levelData = levels[index];
    if (processXP < levelData.xp) return processXP / levelData.xp;
    processXP -= levelData.xp;
  }
  return 1;
};

export const levelInfo = level => levels[level - 1];
