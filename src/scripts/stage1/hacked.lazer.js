import { helicopter } from "./enemies/helicopter.lazer";
import { droneShip } from "./enemies/droneShip.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";
import { droneWave } from "./enemies/drones.lazer";
import { mineWave } from "./enemies/mines.lazer";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  wait,
  setAltitude,
  setBackground,
  parallel,
  showHUD,
  exec
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);
  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["laser-shot", "laser-hit", "explosion", "hero"]);
  playAudio("hero");
  await setScrollingSpeed(250, 0, { instant: true });
  setAltitude(200, { instant: true });
  setBackground("City.Sunrise", 1, 2);
  await setScenery("City.Ocean");
  showHUD();
  text.remove();
  exec(playerShip({ existing: true }));

  await parallel([
    async () => {
      await wait(2000);
      await setAltitude(0);
    },
    () => exec(helicopter("heli.pattern1"))
  ]);

  await parallel([
    () => exec(droneWave(4, "drone.pattern6", 500)),
    async () => {
      await wait(2000);
      await exec(droneWave(4, "drone.pattern6", 500, 0.2));
    },
    async () => {
      await wait(4000);
      await exec(droneWave(4, "drone.pattern6", 500, 0.4));
    }
  ]);
  await exec(droneWave(4, "drone.pattern5", 500));
  await exec(droneShip());
  await exec(droneWave(4, "drone.pattern1", 500));
  await exec(mineWave());
  await setScenery("City.CoastStart");
  await exec(mineWave());
  await parallel([
    () => exec(droneWave(4, "drone.pattern6", 500)),
    async () => {
      await wait(2000);
      await exec(droneWave(4, "drone.pattern6", 500, 0.2));
    },
    async () => {
      await wait(4000);
      await exec(droneWave(4, "drone.pattern6", 500, 0.4));
    }
  ]);
};

export default part;
