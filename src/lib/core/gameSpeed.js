let gameSpeed = 1.0;

export const getGameSpeed = () => gameSpeed;

export const setGameSpeed = speed => {
  gameSpeed = speed;
  Crafty("SpriteAnimation").each(function() {
    if (this.has("TimeManager")) {
      return;
    }
    return (this.animationSpeed = speed);
  });
  Crafty("Delay").each(function() {
    if (this.has("TimeManager")) {
      return;
    }
    return (this.delaySpeed = speed);
  });
  return Crafty("Tween").each(function() {
    if (this.has("TimeManager")) {
      return;
    }
    return (this.tweenSpeed = speed);
  });
};

Crafty.bind("NewEntity", data => {
  const entity = Crafty(data.id);
  if (entity.has("TimeManager")) {
    return;
  }
  if (entity.has("SpriteAnimation")) {
    entity.animationSpeed = gameSpeed;
  }
  if (entity.has("Delay")) {
    entity.delaySpeed = gameSpeed;
  }
  if (entity.has("Tween")) {
    entity.tweenSpeed = gameSpeed;
  }
});
