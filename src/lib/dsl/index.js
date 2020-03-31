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
            if (s.gameEnded === true) throw new Error("Game ended");
            return value(...args);
          }
        : value;
    return a;
  }, {});

export const createScriptExecutionSpace = initialState => {
  let activeScript;
  return script => {
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

    return script(dsl);
  };
};
