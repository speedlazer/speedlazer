//import { getOne, pickOne } from "src/lib/utils";
//import { EASE_IN_OUT } from "src/constants/easing";

const mineFlight = pattern => async ({
  spawn,
  wait,
  //until,
  call,
  //displayFrame,
  waitForEvent,
  moveWithPattern
}) => {
  // spawn drone off screen
  const mine = spawn("Mine", {
    location: {
      rx: 1.1,
      ry: 0.5
    },
    defaultVelocity: 400
  });

  await call(mine.allowDamage, { health: 40 });
  const movement = moveWithPattern(mine, pattern);

  waitForEvent(mine, "Dead", async () => {
    movement.abort();
    await call(mine.showState, "dead");
  });

  await movement.process;
  await wait(400);
  mine.destroy();
};

export const mineWave = (amount, pattern, delay = 1000) => async ({
  exec,
  wait
}) => {
  const items = Array(amount)
    .fill()
    .map(async (e, index) => {
      await wait(index * delay);
      await exec(mineFlight(pattern));
    });
  await Promise.all(items);
};
