export type SceneryCollection = Record<string, SceneryDefinition>;

export type BackgroundDef = [
  animationName: string,
  animationCheckpoint: number,
][];

export type NextSceneryDef = string | Record<string, number>;
export type CompositionFrame = {
  flipX?: boolean;
  attributes?: {
    scale?: number;
    rotation?: number;
    w?: number;
    z?: number;
  };
  spriteAttributes?: Partial<{
    h: number;
    x: number;
    y: number;
    rx: number;
    ry: number;
    z: number;
    rotation: number;
    overrideColor: null | `#${string}`;
    accentColor: null | `#${string}`;
    lightness: number;
    flipX: boolean;
    flipY: boolean;
    horizon: [top: number, bottom: number];
    hidden: boolean;
    scale: number;
    scaleX: number;
    scaleY: number;
    alpha: number;
    maxAlpha: number;
    sprite: string;
    topColor: [`#{string}`, number];
    bottomColor: [`#${string}`, number];
  }>;
};

export type SceneryElement = {
  x: number;
  y: number;
  z?: number;
  w?: number;
  h?: number;
  distance?: number;
  frame?: string;
  attributes?: {};
} & (
  | {
      composition: string | [compositionName: string, CompositionFrame];
    }
  | {
      components: string[];
    }
);

export type SceneryDefinition = {
  /**
   * in pixels
   */
  width: number;
  /**
   * in pixels
   */
  height: number;
  /**
   * Scenery auto placed to the left of this
   * scenery.
   *
   * a string (scenery-key)
   * or and object containing scenery-keys with a chance
   * (0 - 1) of occurring
   *
   * @example "ocean.Sea"
   * @example { "ocean.Sea": 0.5, "ocean.Clouds": 0.5 }
   */
  left: NextSceneryDef;
  /**
   * Scenery auto placed to the right of this
   * scenery.
   *
   * a string (scenery-key)
   * or and object containing scenery-keys with a chance
   * (0 - 1) of occurring
   *
   * @example "ocean.Sea"
   * @example { "ocean.Sea": 0.5, "ocean.Clouds": 0.5 }
   */
  right: NextSceneryDef;
  /**
   * Example backgrounds to show in the editor
   * [animationName, animationCheckpoint]
   *
   * @example [["background.Sunrise", 3]]
   */
  backgrounds?: BackgroundDef;
  /**
   * Different flying heights to try out in the editor
   */
  altitudes?: number[];
  elements: SceneryElement[];
};
