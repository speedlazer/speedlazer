import dataFunctions from "./data";
import flowFunctions from "./flow";
import levelFunctions from "./level";
import entityFunctions from "./entity";

export const createScriptExecutionSpace = () => {
  let activeScript;
  return script => {
    const currentScript = Math.random();
    activeScript = currentScript;
    const dsl = {
      currentScript: () => activeScript === currentScript
    };
    [dataFunctions, levelFunctions, entityFunctions, flowFunctions].forEach(
      functionSet => Object.assign(dsl, functionSet(dsl))
    );

    return script(dsl);
  };
};
