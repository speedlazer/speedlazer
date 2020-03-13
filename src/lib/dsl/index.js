import dataFunctions from "./data";
import flowFunctions from "./flow";
import levelFunctions from "./level";
import entityFunctions from "./entity";
import stateFunctions from "./state";

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
      Object.assign(dsl, functionSet(dsl, initialState))
    );

    return script(dsl);
  };
};
