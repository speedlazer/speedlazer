import { expect } from "chai";

const addEffect = (
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
) => ({
  ...target,
  effects: (target.effects || []).concat({
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
  })
});

const processEffects = (worldRules = {}) => (target, duration) => {
  const { mutations, effects } = target.effects.reduce(
    (acc, effect) => {
      let travelDuration = Infinity;

      if (
        effect.origin &&
        effect.speed &&
        target.x !== undefined &&
        target.y !== undefined
      ) {
        const distance = Math.sqrt(
          Math.pow(target.y - effect.origin.y, 2) +
            Math.pow(target.x - effect.origin.x, 2)
        );
        const traveled = ((effect.active + duration) / 1000) * effect.speed;
        if (distance < traveled) {
          travelDuration = ((traveled - distance) / effect.speed) * 1000;
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
        clippedDelta !== 0
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

const round2 = number => Math.round(number * 100) / 100;

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

  describe("area of effect", () => {
    it("only affects props when effect has reached target", () => {
      const applyEffects = processEffects();

      const target = {
        life: 100,
        x: 10,
        y: 10
      };

      const damage = {
        velocity: -100,
        accelleration: 40,
        upperBounds: 0,
        origin: { x: 100, y: 100 },
        speed: 400,
        affects: ["life"],
        duration: 1000,
        name: "Blast"
      };

      const result = applyEffects(addEffect(target, damage), 10);
      expect(result.life).to.eq(100);

      const result2 = applyEffects(result, 1000);
      expect(round2(result2.life)).to.eq(40.67);
      expect(round2(result2.x)).to.eq(10);
    });

    it("targets closer get hit harder", () => {
      const applyEffects = processEffects();

      const target = {
        life: 100,
        x: 80,
        y: 80
      };

      const damage = {
        velocity: -100,
        accelleration: 40,
        upperBounds: 0,
        origin: { x: 100, y: 100 },
        speed: 400,
        affects: ["life"],
        duration: 1000,
        name: "Blast"
      };

      const result = applyEffects(addEffect(target, damage), 10);
      expect(result.life).to.eq(100);

      const result2 = applyEffects(result, 1000);
      expect(round2(result2.life)).to.eq(24.09);
      expect(round2(result2.x)).to.eq(80);
    });
  });
});
