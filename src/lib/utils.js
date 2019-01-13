import shuffle from "lodash/shuffle";

const first = list => list[0];

export const pickOne = list => first(shuffle(list));
export const getOne = selector => first(shuffle(Crafty(selector).get()));
