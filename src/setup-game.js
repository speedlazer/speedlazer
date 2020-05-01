import AnalogKeyboardControls from "src/components/controls/AnalogKeyboardControls";
import GamepadControls from "src/components/controls/GamepadControls";
import PlayerAssignable from "src/components/player/PlayerAssignable";
import Player from "src/components/player/Player";

export const setupControls = () => {
  const player = Crafty.e([Player, "Color"].join(", "))
    .attr({ name: "Player 1", z: 0, playerNumber: 1 })
    .setName("Player 1")
    .color("#FF0000");

  Crafty.e([AnalogKeyboardControls, PlayerAssignable].join(", ")).controls({
    fire: Crafty.keys.SPACE,
    switchWeapon: Crafty.keys.Z,
    heavy: Crafty.keys.C,
    shield: Crafty.keys.X,
    up: Crafty.keys.UP_ARROW,
    down: Crafty.keys.DOWN_ARROW,
    left: Crafty.keys.LEFT_ARROW,
    right: Crafty.keys.RIGHT_ARROW,
    pause: Crafty.keys.P
  });

  Crafty.e([GamepadControls, PlayerAssignable].join(", ")).controls({
    gamepadIndex: 0,
    fire: 0,
    switchWeapon: 2,
    super: 4,
    pause: 9,
    up: 12,
    down: 13,
    left: 14,
    right: 15
  });

  return player;
};
