Crafty.c("TextInput", {
  init() {
    this.requires("2D, DOM, Text");
  },

  remove() {},

  textInput(player, length) {
    this.defer = WhenJS.defer();

    let name = "A  ";
    let index = 0;

    this.text(name);

    player.bind("Up", () => {
      name = this._updateText(name, index, 1);
      this.text(name);
    });

    player.bind("Down", () => {
      name = this._updateText(name, index, -1);
      this.text(name);
    });

    player.bind("Left", () => {
      index = Math.max(index - 1, 0);
      return this._updateCursor(index);
    });

    player.bind("Right", () => {
      index = Math.min(index + 1, length - 1);
      this._updateCursor(index);
    });

    player.bind("Fire", () => {
      const oldIndex = index;
      index = Math.min(index + 1, length - 1);
      this._updateCursor(index);

      if (index === oldIndex && index === length - 1) {
        player.unbind("Up");
        player.unbind("Down");
        player.unbind("Left");
        player.unbind("Right");
        player.unbind("Fire");
        this.defer.resolve(name);
      }
    });

    this.cursor = Crafty.e("2D, DOM, Text")
      .attr({ x: this.x, y: this.y, w: this.w })
      .text("_  ")
      .textColor("#0000FF")
      .textAlign("left")
      .textFont({
        size: "20px",
        weight: "bold",
        family: "Press Start 2P"
      });
    this.attach(this.cursor);

    return this.defer.promise;
  },

  _updateCursor(index) {
    const c = Array(index + 1).join("&nbsp;") + "_";
    this.cursor.text(c);
  },

  _updateText(name, index, movement) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_.=!$& ";

    const letter = name[index];
    const lindex = chars.indexOf(letter) + chars.length;
    const nletter = chars[(lindex + movement) % chars.length];
    return name.slice(0, index) + nletter + name.slice(index + 1);
  }
});
