import { expect } from "chai";

const addEffect = (
  target,
  { amount = 0, velocity = 0, accelleration = 0, affects, duration = 1 }
) => ({
  ...target,
  effects: (target.effects || []).concat({
    amount,
    affects,
    duration,
    velocity,
    accelleration
  })
});

const processEffects = (target, duration) => {
  const { mutations, effects } = target.effects.reduce(
    (acc, effect) => {
      const calcDuration = Math.min(duration, effect.duration);

      const value = (effect.amount / 1000) * calcDuration;
      const mutations =
        value !== 0
          ? acc.mutations.concat([[effect.affects, e => e + value]])
          : acc.mutations;

      return acc.mutations !== mutations ? { ...acc, mutations } : acc;
    },
    {
      mutations: [],
      effects: target.effects.reduce(
        (acc, effect) =>
          effect.duration > duration
            ? acc.concat({ ...effect, duration: effect.duration - duration })
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

describe("Damage model", () => {
  it("supports direct impact damage", () => {
    const target = {
      life: 100
    };
    const damage = {
      amount: -40 * 1000, // DPS, active for 1 ms
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
      amount: -40,
      affects: "life",
      duration: 600,
      name: "Poison"
    };

    const result = addEffect(target, damage);
    expect(result.life).to.eq(100);

    const resultLater = processEffects(result, 500);
    expect(resultLater.life).to.eq(80);

    const wayLater = processEffects(resultLater, 500);
    expect(wayLater.life).to.eq(76);
  });

  it("supports area of effect");
  it("supports distribution of force");
  it("supports resistance");
  it("supports emitting points");
});
