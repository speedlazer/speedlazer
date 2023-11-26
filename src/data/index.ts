import * as animationData from "./**/*.animation.js";
import * as compositionData from "./**/*.composition.js";
import * as entityData from "./**/*.entity.js";
import * as particleData from "./**/*.particle.js";
import * as pathData from "./**/*.path.js";
import * as sceneryData from "./**/*.scenery.js";
import * as weaponData from "./**/*.weapon.js";

type AssetData = { [key: string]: AssetData };

const dataFlattener = (obj: AssetData) => {
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
  return entries;
};

const flatAnimationData = dataFlattener(animationData);
const flatCompositionData = dataFlattener(compositionData);
const flatEntityData = dataFlattener(entityData);
const flatParticleData = dataFlattener(particleData);
const flatPathData = dataFlattener(pathData);
const flatSceneryData = dataFlattener(sceneryData);
const flatWeaponData = dataFlattener(weaponData);

const dataLoader = (entries: AssetData) => {
  return (key: string) => entries[key];
};

export const animations = dataLoader(flatAnimationData);
export const compositions = dataLoader(flatCompositionData);
export const entities = dataLoader(flatEntityData);
export const particles = dataLoader(flatParticleData);
export const paths = dataLoader(flatPathData);
export const sceneries = dataLoader(flatSceneryData);
export const weapons = dataLoader(flatWeaponData);

export default {
  animations: flatAnimationData,
  compositions: flatCompositionData,
  entities: flatEntityData,
  particles: flatParticleData,
  paths: flatPathData,
  sceneries: flatSceneryData,
  weapons: flatWeaponData
};
