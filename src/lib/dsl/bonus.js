import Crafty from "../../crafty";

const enemyThreshold = 10;
const baseScore = 25;
let scoreThreshold = 100;
let pointsScored = 0;
let enemies = 0;
let multiplier = 1;

export const getMultiplier = () => multiplier;

export const scorePoints = (amount, x, y, dsl) => {
  pointsScored += amount;
  enemies += 1;
  if (pointsScored >= scoreThreshold && enemies >= enemyThreshold) {
    dsl.exec(bonusSpawn(x, y, multiplier * baseScore));

    pointsScored = 0;
    enemies = 0;
    scoreThreshold *= 1.1;
  }
};

export const playerHit = () => {
  reset();
};

export const reset = () => {
  multiplier = 1;
  Crafty.trigger("MultiplierChange", multiplier);
  scoreThreshold = 100;
  pointsScored = 0;
};

const bonusSpawn = (x, y, points) => async ({
  allowDamage,
  showState,
  waitForEvent,
  wait,
  spawn,
  awardPoints,
  moveWithPattern
}) => {
  const bonus = spawn("Bonus", {
    location: {
      x,
      y
    },
    defaultVelocity: 40
  });
  await allowDamage(bonus, { health: 10 });
  waitForEvent(bonus, "Dead", async () => {
    awardPoints(points, x, y, false);
    multiplier += 1;
    Crafty.trigger("MultiplierChange", multiplier);
    await showState(bonus, "pickedUp");
    await wait(2000);
    bonus.destroy();
  });
  const motion = moveWithPattern(bonus, "powerup.short");
  await motion.process;
  await showState(bonus, "disappear", 1000);
  bonus.destroy();
};
