import { isPaused } from "./core/pauseToggle";
import { getGameSpeed } from "./core/gameSpeed";

let gameTime = 0;
const gameLoop = fd => {
  fd.dt = fd.dt * getGameSpeed();
  if (!isPaused()) {
    gameTime += fd.dt;
  }
  fd.inGameTime = gameTime;
  if (fd.dt === 0) return;

  Crafty.trigger("GameLoop", fd);
};
Crafty.uniqueBind("UpdateFrame", gameLoop);
