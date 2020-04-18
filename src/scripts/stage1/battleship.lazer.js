import battleship from "./enemies/battleship.lazer";
import { droneWave } from "./enemies/drones.lazer";
import { playerShip } from "../playerShip.lazer";
import { bigText } from "src/components/BigText";
import { playAudio } from "src/lib/audio";

const part = async ({
  setScrollingSpeed,
  setScenery,
  loadSpriteSheets,
  loadAudio,
  setBackground,
  setBackgroundCheckpoint,
  setBackgroundCheckpointLimit,
  exec
  //wait
}) => {
  const text = bigText("Loading...");
  text.fadeIn(2000);

  await loadSpriteSheets(["mega-texture"]);
  await loadAudio(["laser-shot", "laser-hit", "explosion", "hero"]);
  playAudio("hero");

  await setScrollingSpeed(100, 0);
  await setScenery("City.Coast");
  setBackground("City.Sunrise");
  setBackgroundCheckpointLimit(2);
  setBackgroundCheckpoint(2);
  text.remove();
  exec(playerShip({ existing: true }));

  await exec(droneWave(5, "drone.pattern2", 500));
  await exec(droneWave(5, "drone.pattern1", 500));
  await exec(droneWave(5, "drone.pattern1", 500));
  await exec(droneWave(5, "drone.pattern1", 500));

  await exec(battleship);
};

export default part;
