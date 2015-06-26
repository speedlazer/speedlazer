'use strict';

var levelGenerator = {
  buildingBlocks: {},

  createLevel: function (data) {
    var level = {
      blocks: [],
      data: data,
      bufferLength: 1500,
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
  _generateBlocks: function (amount, settings) {
    if (this.blocks.length == 0) return;
    var settings = settings || {};
    // Get the current tile type
    var tileType = this.blocks[this.blocks.length -1].tileType;
    for (var i = 0; i < amount; i++) {
      this.addBlock(tileType, settings);
      tileType = this.generator._determineNextTileType.call(this, tileType, settings);
    }
  },
  _determineNextTileType: function (tileType, settings) {
    var candidates = this.generator.buildingBlocks[tileType].next;

    var maxAllowedRepitition = 2;
    var blockCount = this.blocks.length;

    if (blockCount >= maxAllowedRepitition) {
      var repetitionCount = 0;

      for (var i = blockCount - 1; i >= 0; i--) {
        var block = this.blocks[i];
        if (block.tileType === tileType) {
          repetitionCount++;
        } else {
          break;
        }
      }

      if (repetitionCount >= maxAllowedRepitition) {
        var newCandidates = []; // Make sure repetition does not continue
        for (var c = 0; c < candidates.length; c ++) {
          if (candidates[c] !== tileType) {
            newCandidates.push(candidates[c]);
          }
        }
        candidates = newCandidates;
      }
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  },
  _addBlock: function (tileType, settings) {
    this.blocks.push({
      index: this.blocks.length,
      tileType: tileType,
      deltaX: this.generator.buildingBlocks[tileType].deltaX,
      deltaY: this.generator.buildingBlocks[tileType].deltaY,
      generated: false,
      settings: settings || {},
      createdElements: [],
      createdBindings: [],
      level: this,
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
    var startX = this.blocks[start].x;
    var endX = startX + this.bufferLength;

    this.generator._buildPieces.call(this, start, endX);
    if (start <= 0) {
      return;
    }
    this.generator._cleanupPieces.call(this, start);
  },
  _buildPieces: function (start, endX) {
    var startX = this.blocks[start].x;

    for (var i = start; i < this.blocks.length; i++) {
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
      if (this.generationPosition.x > endX) {
        break;
      }
    }
  },
  _cleanupPieces: function (end) {
    var cleanUpFrom = end - 6;
    if (cleanUpFrom < 0) {
      cleanUpFrom = 0;
    }
    for (var i = cleanUpFrom; i < end; i++) {
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
    for (var j = 0; j < this.createdBindings.length; j++) {
      var binding = this.createdBindings[j];
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
    };
    this.createdBindings.push({
      event: event,
      callback: realCallback
    });
    Crafty.bind(event, realCallback);
  }
};

// Export
window.Game.levelGenerator = levelGenerator;
