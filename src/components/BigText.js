Crafty.c("BigText", {
  init() {
    this.requires("2D, Text, Tween, Delay, UILayerDOM");
  },

  bigText(text, options = {}) {
    options = {
      color: "#EEEEEE",
      mode: "fadeIn",
      super: null,
      blink_amount: 3,
      blink_speed: 1000,
      ...options
    };
    const modes = {
      fadeIn: {
        enter(elements) {
          return new Promise(resolve => {
            elements[0].one("TweenEnd", resolve);
            elements.forEach(element => element.tween({ alpha: 1 }, 3000));
          });
        },
        wait(elements) {
          return new Promise(resolve => elements[0].delay(resolve, 3000, 0));
        },
        leave(elements) {
          return new Promise(resolve => {
            elements[0].one("TweenEnd", resolve);
            elements.forEach(element =>
              element.tween({ viewportY: element.viewportY + 100, alpha: 0 }, 1500)
            );
          });
        }
      },

      blink: {
        enter(elements) {
          elements.forEach(element => element.attr({ alpha: 1 }));
          return Promise.resolve();
        },
        wait(elements) {
          return new Promise(resolve =>
            elements[0].delay(
              () =>
                elements.forEach(element =>
                  element.attr({ alpha: (element.alpha + 1) % 2 })
                ),
              options.blink_speed,
              (options.blink_amount - 1) * 2 + 1,
              resolve
            )
          );
        },
        leave(elements) {
          elements.forEach(element => element.attr({ alpha: 0 }));
          return Promise.resolve();
        }
      }
    };

    const texts = [this];
    if (options.super != null) {
      const ch = Crafty.e("2D, Text, Tween, UILayerDOM")
        .attr({ w: Crafty.viewport.width, z: 1, alpha: 0 })
        .textAlign("center")
        .text(options.super)
        .attr({
          x: this.x,
          y: 200,
          z: -1
        })
        .textColor(options.color)
        .textFont({
          size: "16px",
          weight: "bold",
          family: "Press Start 2P"
        });
      texts.push(ch);
    }

    this.attr({ w: Crafty.viewport.width, z: 1, alpha: 0 })
      .textAlign("center")
      .text(text)
      .attr({
        x: this.x,
        y: 240,
        z: -1
      })
      .textColor(options.color)
      .textFont({
        size: "30px",
        weight: "bold",
        family: "Press Start 2P"
      });

    const mode = modes[options.mode];
    return mode
      .enter(texts)
      .then(() =>
        mode
          .wait(texts)
          .then(() =>
            mode.leave(texts).then(() => texts.forEach(t => t.destroy()))
          )
      );
  }
});
