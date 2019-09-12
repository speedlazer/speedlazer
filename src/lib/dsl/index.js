import dataFunctions from "./data";
import flowFunctions from "./flow";
import levelFunctions from "./level";
import shipFunctions from "./ship";
import entityFunctions from "./entity";

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
