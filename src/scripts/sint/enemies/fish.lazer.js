import { paths } from "../../../data";

const fishFlight =
  (pattern, yOffset = 0, points = 0, speed = null) =>
  async ({
    spawn,
    showState,
    waitForEvent,
    allowDamage,
    awardPoints,
    moveWithPattern,
  }) => {
    const flyPattern = paths(pattern).path;
    const fish = spawn("WarFish", {
      location: {
        rx: flyPattern[0].x,
        ry: flyPattern[0].y + yOffset,
      },
      defaultVelocity: speed || 300,
    });

    await allowDamage(fish, { health: 30 });
    const movement = moveWithPattern(fish, pattern);

    waitForEvent(fish, "Dead", async () => {
      movement.abort();
      if (points > 0) {
        awardPoints(points, fish.x, fish.y);
      }
      await showState(fish, "dead");
      fish.destroy();
    });

    await movement.process;
    if (movement.wasCompleted()) {
      fish.destroy();
    }
  };

export const fishWave =
  (
    amount,
    pattern,
    { points = 10, delay = 500, yOffset = 0, speed = null } = {},
  ) =>
  async ({ exec, wait }) =>
    Promise.all(
      Array(amount)
        .fill(0)
        .map(async (e, index) => {
          await wait(index * delay);
          await exec(fishFlight(pattern, yOffset, points, speed));
        }),
    );
