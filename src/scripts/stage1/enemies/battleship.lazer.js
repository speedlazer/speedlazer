import { bigText } from "src/components/BigText";
import { say } from "src/lib/Dialog";
import { EASE_IN_OUT } from "src/constants/easing";

const battleship = async ({
  parallel,
  spawn,
  wait,
  call,
  moveTo,
  setScrollingSpeed
}) => {
  let activeMovement;
  const text = bigText("Warning!", { color: "#FF0000" });
  await parallel([
    () => text.blink(500, 4),
    () => setScrollingSpeed(100, 0),
    () =>
      say("John", "Battleship approaching!", { portrait: "portraits.pilot" })
  ]);

  text.remove();

  // Fases:
  // - Mine cannon
  // - Cabin 2 - low stress, Single cannon, invincible
  // - Helicopters
  // - Cabin 2 - medium stress, 2 cannons, invincible
  // - Radar waves, 2 canons at same time, kill cannons
  // - Cabin 2 - destroy
  // - Sink ship
  //

  // spawn ship off screen
  const ship = spawn("BattleShip", {
    location: {
      rx: 1.1,
      ry: 0.75
    },
    defaultVelocity: 85
  });
  activeMovement = moveTo(ship, { x: 0.8 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await wait(4000);

  activeMovement = moveTo(ship, { x: 0.5 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await wait(4000);

  activeMovement = moveTo(ship, { x: 0.1 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await wait(4000);

  activeMovement = moveTo(ship, { x: -0.8 }, null, EASE_IN_OUT);
  await activeMovement.process;
  activeMovement = moveTo(ship, { x: -1.1 }, null, EASE_IN_OUT);

  const playerShip = Crafty("PlayerShip").get(0);
  await parallel([
    () => activeMovement.process,
    async () => {
      await wait(2000);
      await call(playerShip.showState, "turned");
      await setScrollingSpeed(-50, 0);
    }
  ]);

  activeMovement = moveTo(ship, { x: -0.9 }, null, EASE_IN_OUT);
  await activeMovement.process;
  await wait(4000);

  activeMovement = moveTo(ship, { x: -0.4 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await wait(4000);

  activeMovement = moveTo(ship, { x: 0.4 }, null, EASE_IN_OUT);
  await activeMovement.process;
  await call(playerShip.showState, "turned");
  await setScrollingSpeed(100, 0);

  await wait(4000);

  activeMovement = moveTo(ship, { x: -0.2 }, null, EASE_IN_OUT);
  await activeMovement.process;

  await wait(4000);

  activeMovement = moveTo(ship, { x: -1.5 }, null, EASE_IN_OUT);
  await activeMovement.process;

  ship.destroy();
};

export default battleship;
