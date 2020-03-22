export const distance = (x1, y1, x2, y2) =>
  Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));

export const normalize = (x1, y1, x2, y2) => {
  const dist = distance(x1, y1, x2, y2);
  return [(x2 - x1) / dist, (y2 - y1) / dist];
};

export const addEffect = (
  target,
  {
    affects,
    duration = 1,
    velocity = 0,
    accelleration = 0,
    upperBounds = Infinity,
    lowerBounds = -Infinity,
    origin,
    speed,
    name = "Impact"
  }
) => {
  target.effects = (target.effects || []).concat({
    affects,
    duration,
    velocity,
    accelleration,
    upperBounds,
    lowerBounds,
    active: 0,
    origin,
    speed,
    name
  });
  return target;
};

export const processEffects = (worldRules = {}) => (target, duration) => {
  if (target.effects === undefined || target.effects.length === 0) return false;
  const { mutations, effects } = target.effects.reduce(
    (acc, effect) => {
      let travelDuration = Infinity;
      if (
        effect.origin &&
        effect.speed &&
        target.x !== undefined &&
        target.y !== undefined
      ) {
        const dist = distance(
          target.x,
          target.y,
          effect.origin.x,
          effect.origin.y
        );
        const traveled = ((effect.active + duration) / 1000) * effect.speed;
        if (dist < traveled) {
          travelDuration = ((traveled - dist) / effect.speed) * 1000;
        } else {
          travelDuration = 0;
        }
      }

      const calcDuration =
        Math.min(duration, travelDuration, effect.duration) / 1000;

      const worldEffect = (prop, amount) => {
        if (worldRules[prop]) {
          return worldRules[prop](amount, effect, target);
        }
        return { [prop]: amount };
      };

      const delta =
        effect.velocity * calcDuration +
        0.5 * effect.accelleration * calcDuration * calcDuration;

      const clippedDelta =
        delta > effect.upperBounds
          ? effect.upperBounds
          : delta < effect.lowerBounds
          ? effect.lowerBounds
          : delta;

      const mutations =
        clippedDelta !== 0
          ? acc.mutations.concat(
              []
                .concat(effect.affects)
                .reduce(
                  (acc, prop) =>
                    acc.concat(
                      Object.entries(worldEffect(prop, clippedDelta)).reduce(
                        (acc, [prop, amount]) =>
                          acc.concat([[prop, e => e + amount]]),
                        []
                      )
                    ),
                  []
                )
            )
          : acc.mutations;

      return acc.mutations !== mutations ? { ...acc, mutations } : acc;
    },
    {
      mutations: [],
      effects: target.effects.reduce(
        (acc, effect) =>
          effect.duration > duration
            ? acc.concat({
                ...effect,
                duration: effect.duration - duration,
                active: effect.active + duration,
                velocity:
                  effect.velocity + (effect.accelleration * duration) / 1000
              })
            : acc,
        []
      )
    }
  );
  return mutations.reduce(
    (acc, [prop, f]) => {
      const startValue = acc[prop] !== undefined ? acc[prop] : target[prop];
      acc[prop] = f(startValue);
      return acc;
    },
    { effects }
  );
};

const clamp = num => (num > 1 ? 1 : num < 0 ? 0 : num);

export const applyForce = (prevForce, currentForce, mass) =>
  clamp(prevForce * 0.8 + currentForce / mass);
