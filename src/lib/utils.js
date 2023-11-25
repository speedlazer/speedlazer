import shuffle from "lodash/shuffle";
import Crafty from "../crafty";

const first = list => list[0];

export const pickOne = list => first(shuffle(list));
export const getOne = selector => first(shuffle(Crafty(selector).get()));
