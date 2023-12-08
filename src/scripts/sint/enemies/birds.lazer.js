import { paths } from "../../../data";

const birdFlight =
  (pattern, yOffset = 0, points = 0, speed = null, gull = false) =>
  async ({
    spawn,
    showState,
    waitForEvent,
    allowDamage,
    awardPoints,
    moveWithPattern,
  }) => {
    const flyPattern = paths(pattern).path;
    const bird = spawn(gull ? "Seagull" : "WarBird", {
      location: {
        rx: flyPattern[0].x,
        ry: flyPattern[0].y + yOffset,
      },
      defaultVelocity: speed ?? (gull ? 150 : 300),
    });

    await allowDamage(bird, { health: gull ? 120 : 30 });
    const movement = moveWithPattern(bird, pattern);
    if (gull) {
      showState(bird, "shooting");
    }

    waitForEvent(bird, "Dead", async () => {
      movement.abort();
      if (points > 0) {
        awardPoints(points, bird.x, bird.y);
      }
      await showState(bird, "dead");
      bird.destroy();
    });

    await movement.process;
    if (movement.wasCompleted()) {
      bird.destroy();
    }
  };

export const birdWave =
  (
    amount,
    pattern,
    { points = 10, delay = 500, yOffset = 0, speed = null, gull = false } = {},
  ) =>
  async ({ exec, wait }) =>
    Promise.all(
      Array(amount)
        .fill(0)
        .map(async (e, index) => {
          await wait(index * delay);
          await exec(birdFlight(pattern, yOffset, points, speed, gull));
        }),
    );
