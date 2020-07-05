import { helicopter } from "./enemies/helicopter.lazer";
import { droneShip } from "./enemies/droneShip.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import audio from "src/lib/audio";
import { droneWave } from "./enemies/drones.lazer";
import { mineWave } from "./enemies/mines.lazer";
import { checkpoint } from "../common.lazer";

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
  await loadAudio(["effects", "hero"]);
  audio.playAudio("hero");
  await setScrollingSpeed(350, 0, { instant: true });
  setAltitude(200, { instant: true });
  setBackground("city.Sunrise", 1, 2);
  await setScenery("city.Ocean");
  showHUD();
  text.remove();
  exec(playerShip({ existing: true }));

  await parallel([
    async () => {
      await wait(2000);
      await setAltitude(0);
    },
    () => exec(helicopter("heli.pattern1", "heli.repeat1"))
  ]);

  await parallel([
    () => exec(droneWave(4, "drone.pattern6")),
    async () => {
      await wait(2000);
      await exec(droneWave(4, "drone.pattern6", { yOffset: 0.2 }));
    },
    async () => {
      await wait(4000);
      await exec(droneWave(4, "drone.pattern6", { yOffset: 0.4 }));
    }
  ]);
  await exec(droneWave(4, "drone.pattern5"));
  await exec(droneShip());
  await exec(droneWave(4, "drone.pattern1"));
  await exec(mineWave());
  await setScenery("city.CoastStart");
  await exec(mineWave());
  await parallel([
    () => exec(droneWave(4, "drone.pattern6")),
    async () => {
      await wait(2000);
      await exec(droneWave(4, "drone.pattern6", { yOffset: 0.2 }));
    },
    async () => {
      await wait(4000);
      await exec(droneWave(4, "drone.pattern6", { yOffset: 0.4 }));
    }
  ]);
  await exec(droneShip());
  await exec(checkpoint);
};

export default part;
