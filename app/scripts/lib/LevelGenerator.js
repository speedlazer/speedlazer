
var levelGenerator = {
  buildingBlocks: {},

  createLevel: function () {
    var level = {
      blocks: [],
      bufferLength: 3,
      generator: this,
      generationPosition: { x: 0, y: 50 },
      generateBlocks: this._generateBlocks,
      addBlock: this._addBlock,
      start: this._startLevel,
      stop: this._stopLevel,
      _update: this._updateLevel
    };

    return level;
  },

  defineBlock: function (name, obj) {
    this.buildingBlocks[name] = obj;
  },

  // level methods
  _generateBlocks: function (start, amount, fitToEnd) {
    var tileType = start;
    for (var i = 0; i < amount; i++) {
      this.addBlock(tileType);
      var candidates = this.generator.buildingBlocks[tileType].next;
      tileType = candidates[Math.floor(Math.random() * candidates.length)];
    }
  },
  _addBlock: function(tileType, settings) {
    this.blocks.push({
      index: this.blocks.length,
      tileType: tileType,
      deltaX: this.generator.buildingBlocks[tileType].deltaX,
      deltaY: this.generator.buildingBlocks[tileType].deltaY,
      generated: false,
      settings: settings,
      createdElements: [],
      createdBindings: [],
      add: this.generator._addElementToBlock,
      bind: this.generator._addBindingToBlock
    });
  },
  _startLevel: function () {
    this._update(0);
    var self = this;
    Crafty.bind('EnterBlock', function (index) {
      self._update(index);
    });
  },
  _stopLevel: function () {
    Crafty.unbind('EnterBlock');
  },
  _updateLevel: function (start) {
    var end = start + this.bufferLength;
    if (end >= this.blocks.length) {
      end = this.blocks.length;
    }
    for (var i = start; i < end; i++) {
      var piece = this.blocks[i];
      piece.x = piece.x || this.generationPosition.x;
      piece.y = piece.y || this.generationPosition.y;

      if (!piece.generated) {
        this.generator.buildingBlocks[piece.tileType].generate.call(piece, piece.settings);
        this.generator._notifyEnterFunction.call(piece);
        piece.generated = true;
      }
      this.generationPosition.x = piece.x + piece.deltaX;
      this.generationPosition.y = piece.y + piece.deltaY;
    }
    if (start <= 0) {
      return;
    }
    var cleanUpFrom = start - (2 * this.bufferLength);
    if (cleanUpFrom < 0) {
      cleanUpFrom = 0;
    }
    for (var i = cleanUpFrom; i < start; i++) {
      var piece = this.blocks[i];
      this.generator._cleanupFunction.call(piece);
    }
  },
  _notifyEnterFunction: function () {
    var tileIndex = this.index;
    Crafty.e('2D, Canvas, Color, Collision')
      .attr({ x: this.x, y: this.y, w: 10, h: 800 })
      //.color('#FF00FF')
      .onHit('ScrollWall', function () {
        this.destroy();
        Crafty.trigger('EnterBlock', tileIndex);
      });
  },
  _cleanupFunction: function () {
    for (var i = 0; i < this.createdElements.length; i++) {
      this.createdElements[i].destroy();
    }
    this.createdElements = [];
    for (var i = 0; i < this.createdBindings.length; i++) {
      var binding = this.createdBindings[i];
      Crafty.unbind(binding.event, binding.callback);
    }
    this.createdBindings = [];
  },
  _addElementToBlock: function (x, y, element) {
    element.attr({ x: this.x + x, y: this.y + y });
    this.createdElements.push(element);
  },
  _addBindingToBlock: function (event, callback) {
    var self = this;
    var realCallback = function () {
      callback.call(self, arguments);
    }
    this.createdBindings.push({
      event: event,
      callback: realCallback
    });
    Crafty.bind(event, realCallback);
  }
};

// Export
window.Game.levelGenerator = levelGenerator;
