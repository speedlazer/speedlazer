let subscribers = [];

export const endGame = () => {
  subscribers.forEach(s => s());
  subscribers = [];
};

export const subscribe = callback => {
  subscribers.push(callback);
  return () => {
    subscribers = subscribers.filter(e => e !== callback);
  };
};
