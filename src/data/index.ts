import * as animationData from "./**/*.animation.js";
import * as compositionData from "./**/*.composition.js";
import * as entityData from "./**/*.entity.js";
import * as particleData from "./**/*.particle.js";
import * as pathData from "./**/*.path.js";
import * as sceneryData from "./**/*.scenery.js";
import * as weaponData from "./**/*.weapon.js";

type AssetData = { [key: string]: AssetData };

const dataLoader = (obj: AssetData) => {
  const entries = {};

  const getDefault = (object: AssetData) => {
    Object.entries(object).forEach(([key, value]) => {
      if (key === "default") {
        Object.entries(value).forEach(([k, v]) => {
          entries[k] = v;
        });
      } else {
        getDefault(value);
      }
    });
  };
  getDefault(obj);
  return (key: string) => entries[key];
};

export const animations = dataLoader(animationData);
export const compositions = dataLoader(compositionData);
export const entities = dataLoader(entityData);
export const particles = dataLoader(particleData);
export const paths = dataLoader(pathData);
export const sceneries = dataLoader(sceneryData);
export const weapons = dataLoader(weaponData);
