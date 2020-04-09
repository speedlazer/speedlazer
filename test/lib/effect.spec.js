import { expect } from "chai";
import {
  applyForce,
  normalize,
  addEffect,
  processEffects
} from "../../src/lib/effects";

/**
 * Goals:
 *  - Damage
 *  - Cooldown
 *  - Cooldown mutations
 *  - Shockwaves
 */

const round2 = number => Math.round(number * 100) / 100;

describe("Effect model", () => {
  it("returns false if there are no effects active", () => {
    const applyEffects = processEffects();
    const target = {
      life: 100
    };
    const damage = {
      velocity: -40e3, // DPS, active for 1 ms
      affects: "life"
    };

    const result = applyEffects(target, 1);
    expect(result).to.eq(false);
  });

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
      life: (amount, effect, target) => {
        if (effect.name === "Impact") {
          return {
            life: amount - Math.min((target.armor || 0) * 0.01 * amount, 0)
          };
        }
        return { life: amount };
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

    const result2 = applyEffects(addEffect({ ...armoredTarget }, damage), 1);
    expect(result2.life).to.eq(96); // instead of 60
    expect(result2.mana).to.eq(360);

    const poisonResult = applyEffects(
      addEffect({ ...armoredTarget }, poison),
      1
    );
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

      const changes = applyEffects(addEffect(target, damage), 10);
      const result = { ...target, ...changes };
      expect(result.life).to.eq(100);

      const changes2 = applyEffects(result, 1000);
      const result2 = { ...result, ...changes2 };
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

      const changes = applyEffects(addEffect(target, damage), 10);
      const result = { ...target, ...changes };
      expect(result.life).to.eq(100);

      const changes2 = applyEffects(result, 1000);
      const result2 = { ...result, ...changes2 };
      expect(round2(result2.life)).to.eq(24.09);
      expect(round2(result2.x)).to.eq(80);
    });

    it("can move targets using vector from origin", () => {
      const applyEffects = processEffects({
        position: (amount, effect, target) => {
          if (target.weight === undefined) return {};
          const [normX, normY] = normalize(
            effect.origin.x,
            effect.origin.y,
            target.x,
            target.y
          );
          const weighted = amount - amount * target.weight * target.weight;

          return {
            x: weighted * normX,
            y: weighted * normY
          };
        }
      });

      const target1 = {
        life: 100,
        x: 80,
        y: 80,
        weight: 0
      };

      const target2 = {
        life: 100,
        x: 200,
        y: 80,
        weight: 0
      };

      const target3 = {
        life: 100,
        x: 120,
        y: 120,
        weight: 0.5
      };

      const damage = {
        velocity: 100,
        accelleration: -10,
        lowerBounds: 0,
        origin: { x: 100, y: 100 },
        speed: 400,
        affects: ["position"],
        duration: 1000,
        name: "Blast"
      };

      const result = applyEffects(addEffect(target1, damage), 1000);
      expect(round2(result.y)).to.eq(17.34);
      expect(round2(result.x)).to.eq(17.34); // Δ 80 - 17.34 = 62.66

      const result2 = applyEffects(addEffect(target2, damage), 1000);
      expect(round2(result2.x)).to.eq(270.34);
      expect(round2(result2.y)).to.eq(65.93);

      const result3 = applyEffects(addEffect(target3, damage), 1000);
      expect(round2(result3.x)).to.eq(166.99); // Δ 166.99 - 120 = 46.99
      expect(round2(result3.y)).to.eq(166.99);
    });
  });

  it("returns only the mutated properties", () => {
    const applyEffects = processEffects();
    const target = {
      life: 100,
      foo: 842,
      bar: 1337
    };
    const damage = {
      velocity: -40e3, // DPS, active for 1 ms
      affects: "life"
    };

    const result = applyEffects(addEffect(target, damage), 1);
    expect(result.life).to.eq(60);
    expect(result.foo).to.be.undefined;
    expect(result.bar).to.be.undefined;
    expect(result.effects).to.eql([]);
  });

  describe.skip("applyForce", () => {
    it("accellerates when applied", () => {
      let activeForce = 0;
      const mass = 20;

      for (let i = 0; i < 10; i++) {
        activeForce = applyForce(activeForce, 3, mass);
        console.log(activeForce);
      }
      for (let i = 0; i < 10; i++) {
        activeForce = applyForce(activeForce, 0, mass);
        console.log(activeForce);
      }
    });
  });
});
