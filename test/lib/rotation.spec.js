import { expect } from "chai";
import { flipRotation } from "../../src/lib/rotation";

describe("flipRotation", () => {
  it("flips the rotation over the y axis", () => {
    const tests = [
      [0, 180],
      [10, 170],
      [-10, -170],
      [90, 90],
      [-90, -90],
      [-180, -0]
    ];

    tests.forEach(([start, expected]) => {
      expect(flipRotation(start)).to.eq(expected);
    });
  });
});
