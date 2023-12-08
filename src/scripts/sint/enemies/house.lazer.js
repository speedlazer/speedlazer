import { paths } from "../../../data";

export const house =
  (pattern, yOffset = 0, points = 0, speed = null, shooting = false) =>
  async ({
    spawn,
    showState,
    waitForEvent,
    allowDamage,
    awardPoints,
    moveWithPattern,
  }) => {
    const flyPattern = paths(pattern).path;
    const house = spawn(shooting ? "HouseHostile" : "House", {
      location: {
        rx: flyPattern[0].x,
        ry: flyPattern[0].y + yOffset,
      },
      defaultVelocity: speed || 200,
    });
    if (shooting) {
      showState(house, "shooting");
    }
    house
      .addCollisionComponent("SolidCollision")
      .addCollisionComponent("PlayerEnemy");

    waitForEvent(house.chimneyLoc, "Dead", async () => {
      awardPoints(points, house.chimneyLoc.x + 20, house.chimneyLoc.y);
      showState(house, "dead");
      house.chimneyLoc.clearCollisionComponents();
    });
    house.chimneyLoc
      .addCollisionComponent("SolidCollision")
      .addCollisionComponent("PlayerEnemy");
    await allowDamage(house.chimneyLoc, { health: 30 });
    const movement = moveWithPattern(house, pattern);

    await movement.process;
    if (movement.wasCompleted()) {
      house.destroy();
    }
  };

export const houseWave =
  (
    amount,
    pattern,
    {
      points = 10,
      delay = 3_000,
      yOffsets = [0],
      speed = null,
      shootModulo = 1,
    } = {},
  ) =>
  async ({ exec, wait }) =>
    Promise.all(
      Array(amount)
        .fill(0)
        .map(async (e, index) => {
          await wait(index * delay);
          const offset = yOffsets[index % yOffsets.length];
          await exec(
            house(pattern, offset, points, speed, index % shootModulo === 0),
          );
        }),
    );
