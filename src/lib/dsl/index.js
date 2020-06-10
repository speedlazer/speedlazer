import dataFunctions from "./data";
import flowFunctions from "./flow";
import levelFunctions from "./level";
import entityFunctions from "./entity";
import stateFunctions from "./state";

const wrap = (o, s) =>
  Object.entries(o).reduce((a, [key, value]) => {
    a[key] =
      typeof value === "function"
        ? (...args) => {
            if (s.gameEnded === true) throw new Error("Game Over");
            return value(...args);
          }
        : value;
    return a;
  }, {});

export const createScriptExecutionSpace = initialState => {
  let activeScript;
  return async script => {
    const currentScript = Math.random();
    activeScript = currentScript;
    const dsl = {
      currentScript: () => activeScript === currentScript
    };
    [
      dataFunctions,
      levelFunctions,
      entityFunctions,
      flowFunctions,
      stateFunctions
    ].forEach(functionSet =>
      Object.assign(dsl, wrap(functionSet(dsl, initialState), initialState))
    );
    if (initialState.gameEnded === true) return;
    Crafty.one("EndGame", () => {
      activeScript = null;
      initialState.gameEnded = true;
      Crafty.trigger("GameOver");
    });

    try {
      return await script(dsl);
    } finally {
      dsl.closeScript();
    }
  };
};
