import cityEnemies from "src/images/city-enemies.png";
import cityEnemiesMap from "src/images/city-enemies.map.json";
import cityScenery from "src/images/city-scenery.png";
import citySceneryMap from "src/images/city-scenery.map.json";
import trailerScenery from "src/images/dino.png";
import trailerSceneryMap from "src/images/dino.map.json";

const spritesheets = [
  {
    name: "city-enemies",
    image: cityEnemies,
    map: cityEnemiesMap
  },
  {
    name: "city-scenery",
    image: cityScenery,
    map: citySceneryMap
  },
  {
    name: "dino",
    image: trailerScenery,
    map: trailerSceneryMap
  }
];

export default spritesheets;
