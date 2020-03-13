import TweenPromise from "src/components/generic/TweenPromise";

const stateFunctions = (dsl, state) => {
  const lives = Crafty.e(`2D, UILayerDOM, Text, ${TweenPromise}`)
    .attr({ x: 20, y: 10, w: 100, alpha: 0 })
    .textColor("#FFFF00")
    .textAlign("left")
    .textFont({
      size: "8px",
      weight: "bold",
      family: "Press Start 2P"
    })
    .text(`Lives: ${state.lives}`);

  return {
    loseLife: () => {
      state.lives -= 1;
      if (state.lives < 0) throw Error("Game Over");
      lives.text(`Lives: ${state.lives}`);
    },
    showHUD: () => Crafty("UILayerDOM").tweenPromise({ alpha: 1 }, 1000),
    hideHUD: () => Crafty("UILayerDOM").tweenPromise({ alpha: 0 }, 1000)
  };
};

export default stateFunctions;
