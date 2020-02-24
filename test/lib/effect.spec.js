import { expect } from "chai";

const addEffect = (
  target,
  {
    velocity = 0,
    accelleration = 0,
    affects,
    duration = 1,
    upperBounds = Infinity,
    lowerBounds = -Infinity,
    name = "Impact"
  }
) => ({
  ...target,
  effects: (target.effects || []).concat({
    affects,
    duration,
    velocity,
    accelleration,
    upperBounds,
    lowerBounds,
    name
  })
});

const processEffects = (worldRules = {}) => (target, duration) => {
  const { mutations, effects } = target.effects.reduce(
    (acc, effect) => {
      const calcDuration = Math.min(duration, effect.duration) / 1000;
      const worldEffect = (prop, amount) => {
        if (worldRules[prop]) {
          return worldRules[prop](amount, effect, target);
        }
        return amount;
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
        delta !== 0
          ? acc.mutations.concat(
              []
                .concat(effect.affects)
                .map(prop => [prop, e => e + worldEffect(prop, clippedDelta)])
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

/**
 * Goals:
 *  - Damage
 *  - Cooldown
 *  - Cooldown mutations
 *  - Shockwaves
 */

describe("Effect model", () => {
  it("supports direct impact damage", () => {
    const applyEffects = processEffects();
    const target = {
      life: 100
    };
    const damage = {
      velocity: -40e3, // DPS, active for 1 ms
      affects: "life"
    };

    const result = applyEffects(addEffect(target, damage), 1);
    expect(result.life).to.eq(60);
    expect(result.effects).to.eql([]);
  });

  it("can affect multiple properties", () => {
    const applyEffects = processEffects();
    const target = {
      life: 100,
      mana: 400
    };
    const damage = {
      velocity: -40e3, // DPS, active for 1 ms
      affects: ["life", "mana"]
    };

    const result = applyEffects(addEffect(target, damage), 1);
    expect(result.life).to.eq(60);
    expect(result.mana).to.eq(360);
    expect(result.effects).to.eql([]);
  });

  it("supports damage over time", () => {
    const applyEffects = processEffects();
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

    const resultLater = applyEffects(result, 500);
    expect(resultLater.life).to.eq(80);

    const endResult = applyEffects(resultLater, 500);
    expect(endResult.life).to.eq(60); // 100 - 40

    const endResult2 = applyEffects(resultLater, 1500);
    expect(endResult2.life).to.eq(60);
  });

  it("supports accelleration over time", () => {
    const applyEffects = processEffects();
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

    const resultLater = applyEffects(result, 500);
    expect(resultLater.life).to.eq(81.25);

    const endResult = applyEffects(resultLater, 500);
    expect(endResult.life).to.eq(65);

    const endResult2 = applyEffects(resultLater, 1500);
    expect(endResult2.life).to.eq(65);

    const endResult3 = applyEffects(result, 1500);
    expect(endResult3.life).to.eq(65);

    const endResult4 = applyEffects(applyEffects(result, 250), 250);
    expect(endResult4.life).to.eq(81.25);
  });

  it("supports upper clipping of amount values", () => {
    const applyEffects = processEffects();
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

    const resultLater = applyEffects(result, 250);
    expect(resultLater.life).to.eq(91.5625);

    const endResult = applyEffects(resultLater, 500);
    expect(endResult.life).to.eq(84.0625);
  });

  it("supports lower clipping of amount values", () => {
    const applyEffects = processEffects();
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

    const resultLater = applyEffects(result, 250);
    expect(resultLater.life).to.eq(86.875);

    const endResult = applyEffects(resultLater, 800);
    expect(endResult.life).to.eq(36.875);
  });

  it("supports resistance", () => {
    const applyEffects = processEffects({
      life: (amount, damage, target) => {
        if (damage.name === "Impact") {
          return amount - Math.min((target.armor || 0) * 0.01 * amount, 0);
        }
        return amount;
      }
    });

    const target = {
      life: 100,
      armor: 30,
      mana: 400
    };
    const armoredTarget = {
      life: 100,
      armor: 90,
      mana: 400
    };

    const damage = {
      velocity: -40e3, // DPS, active for 1 ms
      affects: ["life", "mana"],
      name: "Impact"
    };
    const poison = {
      velocity: -40e3, // DPS, active for 1 ms
      affects: ["life", "mana"],
      name: "Poison"
    };

    const result = applyEffects(addEffect(target, damage), 1);
    expect(result.life).to.eq(72); // instead of 60
    expect(result.mana).to.eq(360);

    const result2 = applyEffects(addEffect(armoredTarget, damage), 1);
    expect(result2.life).to.eq(96); // instead of 60
    expect(result2.mana).to.eq(360);

    const poisonResult = applyEffects(addEffect(armoredTarget, poison), 1);
    expect(poisonResult.life).to.eq(60); // no resistance
    expect(poisonResult.mana).to.eq(360);
  });
});