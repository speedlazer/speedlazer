import { expect } from "chai";

const addEffect = (
  target,
  {
    velocity = 0,
    accelleration = 0,
    affects,
    duration = 1,
    upperBounds = Infinity,
    lowerBounds = -Infinity
  }
) => ({
  ...target,
  effects: (target.effects || []).concat({
    affects,
    duration,
    velocity,
    accelleration,
    upperBounds,
    lowerBounds
  })
});

const processEffects = (target, duration) => {
  const { mutations, effects } = target.effects.reduce(
    (acc, effect) => {
      const calcDuration = Math.min(duration, effect.duration) / 1000;

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
        delta !== 0
          ? acc.mutations.concat([[effect.affects, e => e + clippedDelta]])
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
      acc[prop] = f(acc[prop]);
      return acc;
    },
    { ...target, effects }
  );
};

describe("Effect model", () => {
  it("supports direct impact damage", () => {
    const target = {
      life: 100
    };
    const damage = {
      velocity: -40e3, // DPS, active for 1 ms
      affects: "life"
    };

    const result = processEffects(addEffect(target, damage), 1);
    expect(result.life).to.eq(60);
    expect(result.effects).to.eql([]);
  });

  it("supports damage over time", () => {
    const target = {
      life: 100
    };
    const damage = {
      velocity: -40,
      affects: "life",
      duration: 1000,
      name: "Poison"
    };

    const result = addEffect(target, damage);
    expect(result.life).to.eq(100);

    const resultLater = processEffects(result, 500);
    expect(resultLater.life).to.eq(80);

    const endResult = processEffects(resultLater, 500);
    expect(endResult.life).to.eq(60); // 100 - 40

    const endResult2 = processEffects(resultLater, 1500);
    expect(endResult2.life).to.eq(60);
  });

  it("supports accelleration over time", () => {
    const target = {
      life: 100
    };
    const damage = {
      velocity: -40,
      accelleration: 10,
      affects: "life",
      duration: 1000,
      name: "Poison"
    };

    const result = addEffect(target, damage);
    expect(result.life).to.eq(100);

    const resultLater = processEffects(result, 500);
    expect(resultLater.life).to.eq(81.25);

    const endResult = processEffects(resultLater, 500);
    expect(endResult.life).to.eq(65);

    const endResult2 = processEffects(resultLater, 1500);
    expect(endResult2.life).to.eq(65);

    const endResult3 = processEffects(result, 1500);
    expect(endResult3.life).to.eq(65);

    const endResult4 = processEffects(processEffects(result, 250), 250);
    expect(endResult4.life).to.eq(81.25);
  });

  it("supports upper clipping of amount values", () => {
    const target = {
      life: 100
    };
    const damage = {
      velocity: -40,
      accelleration: 50,
      upperBounds: 0,
      affects: "life",
      duration: 1000,
      name: "Poison"
    };

    const result = addEffect(target, damage);
    expect(result.life).to.eq(100);

    const resultLater = processEffects(result, 250);
    expect(resultLater.life).to.eq(91.5625);

    const endResult = processEffects(resultLater, 500);
    expect(endResult.life).to.eq(84.0625);
  });

  it("supports lower clipping of amount values", () => {
    const target = {
      life: 100
    };
    const damage = {
      velocity: -40,
      accelleration: -100,
      lowerBounds: -50,
      affects: "life",
      duration: 1000,
      name: "Poison"
    };

    const result = addEffect(target, damage);
    expect(result.life).to.eq(100);

    const resultLater = processEffects(result, 250);
    expect(resultLater.life).to.eq(86.875);

    const endResult = processEffects(resultLater, 800);
    expect(endResult.life).to.eq(36.875);
  });

  it("supports area of effect");
  it("supports distribution of force");
  it("supports resistance");
  it("supports emitting points");
});
