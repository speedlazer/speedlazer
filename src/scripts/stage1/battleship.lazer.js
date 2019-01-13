import { getOne, pickOne } from "src/utils";
import { EASE_IN_OUT } from "src/constants/easing";

/**
 * NOTES:
 *
 * Identified DSL functions:
 *
 * - spawn
 *   Creates a new entity in the playingfield
 * - exec
 *   Executes a script providing DSL functions
 * - delay
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

// dummy sub scripts for now
const shipMines = async () => {};
const fireMine = async () => {};

const popupRandomCannon = async ({ call, action, delay, when }, { ship }) => {
  const hatch = pickOne([ship.hatch1, ship.hatch2, ship.hatch3]);
  await action(hatch, "open");
  await action(hatch, "rise");
  await delay(1000);

  const target = getOne("PlayerShip");
  await call(hatch.turret.aim, { target: target });
  await action(hatch, "fire");
  await when(
    async ({ delay }) => await delay(5000),
    async ({ call, delay }) => {
      await call(hatch.turret.aim, { target: target });
      await delay(80);
    }
  );
  await call(hatch.turret.resetAim);
  await action(hatch, "lower");
  await action(hatch, "close");
};

const battleship = async ({ spawn, exec, move, when, call }) => {
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
      rx: 1.1,
      ry: 0.7
    },
    defaultSpeed: 85
  });
  await exec(shipMines, { amount: 10 });
  await move(ship, { rx: 0.8, easing: EASE_IN_OUT });
  await call(ship.mineCannon.allowDamage, { health: 600 });

  await when(
    async ({ call }) => call(ship.mineCannon.hasHealth),
    async ({ call, exec, delay }) => {
      const target = getOne("PlayerShip");
      await call(ship.mineCannon.aim, { target: target });
      await exec(fireMine, { origin: ship.mineCannon.aimVector(), target });
      await delay(400);
    }
  );

  await call(ship.setState, "fase2");
  await move(ship, { rx: -0.05, easing: EASE_IN_OUT });

  await call(ship.cabin2.allowDamage, { health: 800 });
  await when(
    async ({ call }) => call(ship.cabin2.hasHealth),
    async dsl => {
      await popupRandomCannon(dsl, { ship });
    }
  );
};

export default battleship;
