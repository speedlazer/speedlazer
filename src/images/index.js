import trailerScenery from "./dino.png";
import trailerSceneryMap from "./dino.map.json";

import megaTexture from "./mega-texture.png";
import completeTextureMap from "./mega-texture.map.json";

const spritesheets = [
  { name: "mega-texture", image: megaTexture, map: completeTextureMap },
  {
    name: "dino",
    image: trailerScenery,
    map: trailerSceneryMap
  }
];

export default spritesheets;
