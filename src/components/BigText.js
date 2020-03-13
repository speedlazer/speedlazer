export const bigText = (text, { color = "#FFFFFF", sup = null } = {}) => {
  const createTextEntity = (text, color, size, y) =>
    Crafty.e(" 2D, Text, Tween, UILayerDOM, Delay")
      .attr({ w: Crafty.viewport.width, z: 1, alpha: 0, baseText: text })
      .textAlign("center")
      .text(text)
      .attr({ y })
      .textColor(color)
      .textFont({
        size,
        weight: "bold",
        family: "Press Start 2P"
      });

  const entity = createTextEntity(text, color, "30px", 240);
  let items = [entity];

  if (sup) {
    const supScript = createTextEntity(sup, color, "16px", 200);
    items = items.concat(supScript);
  }

  return {
    fadeIn: duration =>
      new Promise(resolve => {
        items[0].one("TweenEnd", resolve);
        items.forEach(e => e.tween({ alpha: 1 }, duration));
      }),
    fadeOut: duration =>
      new Promise(resolve => {
        items[0].one("TweenEnd", resolve);
        items.forEach(e => e.tween({ alpha: 0 }, duration));
      }),
    show: () => {
      items.forEach(e => e.attr({ alpha: 1 }));
    },
    hide: () => {
      items.forEach(e => e.attr({ alpha: 0 }));
    },
    zoomOut: duration =>
      new Promise(resolve => {
        items.forEach(e =>
          e
            .attr({ alpha: 1, scale: 1, avoidCss3dTransforms: true })
            .text(() => {
              e.css({
                transform: `scale(${e.scale})`,
                transformOrigin: "center center"
              });
              return e.baseText;
            })
            .dynamicTextGeneration(true)
        );
        items[0].one("TweenEnd", () => {
          items.forEach(e => {
            e.attr({ alpha: 0, scale: 1, avoidCss3dTransforms: false })
              .text(e.baseText)
              .dynamicTextGeneration(false);
          });
          resolve();
        });
        items.forEach(e => e.tween({ alpha: 0, scale: 3 }, duration));
      }),
    remove: () => {
      items.forEach(e => e.destroy());
    },
    blink: (delay, repeats = 4) =>
      new Promise(resolve => {
        const f = () =>
          items.forEach(e => e.attr({ alpha: (e.alpha + 1) % 2 }));
        items[0].delay(f, delay, repeats * 2 - 1, resolve);
      })
  };
};
