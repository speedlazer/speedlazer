let settings = null;

const getSettings = () => {
  if (settings) {
    return settings;
  }
  const data = localStorage.getItem("SPDLZR-SET");
  if (!data) {
    return {};
  }
  try {
    settings = JSON.parse(data);
  } catch (e) {
    settings = null;
  }

  return settings || {};
};

export const updateSetting = (key, value) => {
  const updated = getSettings();
  updated[key] = value;
  settings = updated;

  localStorage.setItem("SPDLZR-SET", JSON.stringify(updated));
};

export const setting = (item, defaultValue) => {
  const settings = getSettings();
  const value = settings[item];
  return value === undefined ? defaultValue : value;
};

export default setting;
