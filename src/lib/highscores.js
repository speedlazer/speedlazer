import CryptoJS from "crypto-js";
import sortBy from "lodash/sortBy";

export const highscores = () => {
  const loadList = () => {
    const data = localStorage.getItem("SPDLZR");
    if (!data) {
      return [];
    }
    const k = data.slice(0, 20);
    const d = data.slice(20);
    const s = CryptoJS.AES.decrypt(d, k);
    const v = s.toString(CryptoJS.enc.Utf8);
    if (!(v.length > 1)) {
      return [];
    }
    return JSON.parse(v);
  };

  const loadedList = loadList();

  const defInit = "SPL";
  const list = [
    { initials: defInit, score: 30000 },
    { initials: defInit, score: 20000 },
    { initials: defInit, score: 10000 },
    { initials: defInit, score: 5000 },
    { initials: defInit, score: 2500 },
    { initials: defInit, score: 1500 },
    { initials: defInit, score: 1000 },
    { initials: defInit, score: 5000 },
    { initials: defInit, score: 2000 },
    { initials: defInit, score: 1500 }
  ].concat(loadedList);
  return sortBy(list, "score").reverse();
};
