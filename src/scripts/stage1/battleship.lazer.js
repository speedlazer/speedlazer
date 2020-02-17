//import { getOne, pickOne } from "src/lib/utils";
//import { EASE_IN_OUT } from "src/constants/easing";
//import ShipControls from "src/components/player/ShipControls";

/**
 * NOTES:
 *
 * Identified DSL functions:
 *
 * - spawn
 *   Creates a new entity in the playingfield
 * - exec
 *   Executes a script providing DSL functions
 * - wait
 *   Waits n milliseconds
 * - when
 *   Keeps executing task 2 when task 1 is pending
 * - call
 *   Executes a normal function providing args, but verifies
 *   if script is still running
 * - action
 *   Executes a normal function, providing args, but provides
 *   the DSL functions as first arg, to provide better execution interuption
 *
 * - move
 *   moves an entity. since moving can have all kinds of durations
 *   it is done by the DSL for proper interupting of execution
 *   (TODO: Maybe change this in an action??)
 *
 * Identified Entity functions:
 *
 * - accessing sub-components directly
 * - action
 *   a small custom script defined in the JSON that does multiple steps,
 *   and has access to the DSL.
 *   Goal is to have it execute entity specific actions, like:
 *   - state changes (with tweening)
 *   - starting/stopping particle emitters
 *   - movement with routes ?? (see todo above)
 *   - The actions should use the data from the entity config file,
 *   so that these are easily visually buildable.
 *   - The sub actions should be added by Crafty Components, like
 *     "Aimable", "State", "Movement", etc.
 *
 * Identified utility functions:
 *
 * - pick/pickOne
 *   make a random subselection from a selection, with max 'x' items
 * - get/getOne
 *   Wrapper around crafty selector as base
 *
 */

//const popupRandomCannon = async ({ call, until, displayFrame }, { ship }) => {
//const hatch = pickOne([ship.hatch1, ship.hatch2, ship.hatch3]);
//await displayFrame(hatch, "open", 500, EASE_IN_OUT);
//await displayFrame(hatch, "risen", 500, EASE_IN_OUT);

//const target = getOne(ShipControls);
//await call(hatch.turret.aim, { target: target });
////await action(hatch, "fire");
//await until(
//async ({ wait }) => {
//await wait(5000);
//},
//async ({ call, wait }) => {
//await call(hatch.turret.aim, { target: target }); //, speed: 100 });
//await wait(200);
//}
//);
//await call(hatch.turret.resetAim);
//await displayFrame(hatch, "open", 500, EASE_IN_OUT);
//await displayFrame(hatch, "default", 500, EASE_IN_OUT);
//};

const battleship = async ({
  spawn,
  wait,
  //until,
  call
  //displayFrame,
  //waitWhile
}) => {
  // Fases:
  // - Mine cannon ✓
  // - Cabin 2 - low stress, Single cannon, invincible ✓
  // - Helicopters
  // - Cabin 2 - medium stress, 2 cannons, invincible
  // - Radar waves, 2 canons at same time, kill cannons
  // - Cabin 2 - destroy
  // - Sink ship
  //

  // spawn ship off screen
  const ship = spawn("BattleShip", {
    location: {
      rx: -0.1,
      //rx: 0.6,
      ry: 0.7
    },
    defaultSpeed: 85
  });

  // try drone
  /*
  const drone = spawn("WarDrone", {
    location: {
      rx: 0.5,
      ry: 0.3
    },
    defaultSpeed: 85
  });
  await call(drone.allowDamage, { health: 4000 });
  await waitWhile(drone.hasHealth);
  await call(drone.showState, "damaged");
  await call(drone.activateGravity);
  */

  /*
  await exec(shipMines, { amount: 10 });
  await move(ship, { rx: 0.8, easing: EASE_IN_OUT });
  await call(ship.mineCannon.allowDamage, { health: 600 });

  await when(
    async ({ call }) => call(ship.mineCannon.hasHealth),
    async ({ call, exec, wait }) => {
      const target = getOne("PlayerShip");
      await call(ship.mineCannon.aim, { target: target });
      await exec(fireMine, { origin: ship.mineCannon.aimVector(), target });
      await wait(400);
    }
  );

  await call(ship.setState, "fase2");
  await move(ship, { rx: -0.05, easing: EASE_IN_OUT });
  */

  await wait(4000);
  //await call(ship.cabin2.allowDamage, { health: 4000 });
  //await until(
  //async ({ waitWhile }) => {
  //await waitWhile(ship.cabin2.hasHealth);
  //await call(ship.showState, "fase3");
  //},
  //async dsl => {
  //await popupRandomCannon(dsl, { ship });
  //}
  //);
  //// Destroy cannon
  //const hatch = ship.hatch1;
  //await displayFrame(hatch, "open", 500, EASE_IN_OUT);
  //await displayFrame(hatch, "risen", 500, EASE_IN_OUT);
  //await displayFrame(hatch.turret, "up", 500, EASE_IN_OUT);
  //await call(hatch.turret.allowDamage, { health: 500 });
  //await waitWhile(hatch.turret.hasHealth);
  //await displayFrame(hatch.turret, "default", 500, EASE_IN_OUT);
  //await displayFrame(hatch, "open", 500, EASE_IN_OUT);
  //await displayFrame(hatch, "default", 500, EASE_IN_OUT);
  await call(ship.showState, "fase4");
  await wait(20000);
  await call(ship.showState, "fase5");
  await wait(30000);

  ship.destroy();
};

export default battleship;
