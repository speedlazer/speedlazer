import dataFunctions from "./dsl/data";
import flowFunctions from "./dsl/flow";
import levelFunctions from "./dsl/level";
import shipFunctions from "./dsl/ship";
import entityFunctions from "./dsl/entity";

export const createScriptExecutionSpace = () => {
  // determine script 'seed' to stop execution
  //const state = {
  //running: true
  //};

  const dsl = {
    ...dataFunctions(),
    ...levelFunctions(),
    ...shipFunctions(),
    ...entityFunctions()
  };
  Object.assign(dsl, flowFunctions(dsl));
  return dsl;
};
