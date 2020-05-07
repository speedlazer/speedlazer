export default {
  "Test.Walls": {
    width: 1023,
    height: 576,
    right: "Test.Walls",
    left: "Test.Walls",
    elements: [
      {
        components: ["BulletSolid", "Collision"],
        x: 100,
        y: -385,
        composition: "test.wall"
      },
      {
        components: ["BulletSolid", "Collision"],
        x: 700,
        y: -485,
        composition: "test.wall"
      }
    ]
  }
};
