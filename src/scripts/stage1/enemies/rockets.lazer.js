import { EASE_IN } from "../../../constants/easing";
import shuffle from "lodash/shuffle";

const rocketFlight = (index, coord) => async ({
  spawn,
  wait,
  moveTo,
  allowDamage,
  showState,
  waitForEvent
}) => {
  let activeMovement = null;
  await wait(index * 100);

  const rocket = spawn("HeliRocket", {
    location: { rx: 1.1, ry: coord.y },
    defaultVelocity: 500
  });
  waitForEvent(rocket, "Dead", async () => {
    activeMovement && activeMovement.abort();
    await showState(rocket, "explode");
    await wait(500);
    rocket.destroy();
  });
  await allowDamage(rocket, { health: 3 });

  activeMovement = moveTo(rocket, { x: -0.1 }, null, EASE_IN);
  await activeMovement.process;
  if (activeMovement.wasCompleted()) {
    rocket.destroy();
  }
};

export const rocketStrike = () => async ({ exec }) => {
  const amount = 5;

  const coords = shuffle([
    { y: 0.8 },
    { y: 0.7 },
    { y: 0.6 },
    { y: 0.5 },
    { y: 0.4 },
    { y: 0.3 },
    { y: 0.2 }
  ]);

  const items = Array(amount)
    .fill()
    .map(async (_, index) => {
      await exec(rocketFlight(index, coords[index]));
    });
  await Promise.all(items);
};
