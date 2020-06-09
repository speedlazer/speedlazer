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

  const initials = "SPL";
  const list = [
    { initials, score: 30000 },
    { initials, score: 20000 },
    { initials, score: 10000 },
    { initials, score: 5000 },
    { initials, score: 2500 },
    { initials, score: 1500 },
    { initials, score: 1000 },
    { initials, score: 5000 },
    { initials, score: 2000 },
    { initials, score: 1500 }
  ].concat(loadedList);
  return sortBy(list, "score").reverse();
};
