(function() {
  var Level, LevelBlock, LevelGenerator;

  LevelGenerator = (function() {
    function LevelGenerator() {
      this.buildingBlocks = {};
    }

    LevelGenerator.prototype.defineBlock = function(klass) {
      return this.buildingBlocks[klass.prototype.name] = klass;
    };

    LevelGenerator.prototype.createLevel = function(data) {
      return new Level(this, data);
    };

    return LevelGenerator;

  })();

  Level = (function() {
    function Level(generator, data1) {
      this.generator = generator;
      this.data = data1;
      this.blocks = [];
      this.bufferLength = 2500;
      this.generationPosition = {
        x: 0,
        y: 50
      };
    }

    Level.prototype.addBlock = function(tileType, settings) {
      var block, klass;
      if (settings == null) {
        settings = {};
      }
      klass = this.generator.buildingBlocks[tileType];
      block = new klass(this, settings);
      return this.blocks.push(block);
    };

    Level.prototype.generateBlocks = function(amount, settings) {
      var j, lastBlock, num, ref, results, tileType;
      if (settings == null) {
        settings = {};
      }
      if (this.blocks.length === 0) {
        return;
      }
      lastBlock = this.blocks[this.blocks.length - 1];
      tileType = lastBlock.name;
      results = [];
      for (num = j = 1, ref = amount; 1 <= ref ? j <= ref : j >= ref; num = 1 <= ref ? ++j : --j) {
        tileType = this._determineNextTileType(tileType, settings);
        results.push(this.addBlock(tileType, settings));
      }
      return results;
    };

    Level.prototype.start = function() {
      this._update(0);
      this.blocks[0].enter();
      Crafty.bind('LeaveBlock', (function(_this) {
        return function(index) {
          _this._update(index);
          if (index > 0) {
            _this.blocks[index].inScreen();
            return _this.blocks[index - 1].leave();
          }
        };
      })(this));
      return Crafty.bind('EnterBlock', (function(_this) {
        return function(index) {
          return _this.blocks[index].enter();
        };
      })(this));
    };

    Level.prototype.stop = function() {
      var b, j, len, ref, results;
      Crafty.unbind('LeaveBlock');
      Crafty.unbind('EnterBlock');
      ref = this.blocks;
      results = [];
      for (j = 0, len = ref.length; j < len; j++) {
        b = ref[j];
        results.push(b.clean());
      }
      return results;
    };

    Level.prototype._update = function(start) {
      var block, endX, i, j, len, ref, ref1, results, startX;
      startX = ((ref = this.blocks[start]) != null ? ref.x : void 0) || 0;
      endX = startX + this.bufferLength;
      ref1 = this.blocks;
      results = [];
      for (i = j = 0, len = ref1.length; j < len; i = ++j) {
        block = ref1[i];
        if (!(i >= start)) {
          continue;
        }
        block.build(this.generationPosition, i);
        this.generationPosition = {
          x: block.x + block.delta.x,
          y: block.y + block.delta.y
        };
        if (this.generationPosition.x > endX) {
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    Level.prototype._determineNextTileType = function(tileType, settings) {
      var block, blockCount, blockKlass, candidate, candidates, j, k, len, maxAllowedRepitition, newCandidates, ref, repetitionCount;
      blockKlass = this.generator.buildingBlocks[tileType];
      candidates = blockKlass.prototype.next;
      maxAllowedRepitition = 2;
      blockCount = this.blocks.length;
      if (blockCount >= maxAllowedRepitition) {
        repetitionCount = 0;
        ref = this.blocks;
        for (j = ref.length - 1; j >= 0; j += -1) {
          block = ref[j];
          if (block.tileType === tileType) {
            repetitionCount++;
          } else {
            break;
          }
        }
        if (repetitionCount >= maxAllowedRepitition) {
          newCandidates = [];
          for (k = 0, len = candidates.length; k < len; k++) {
            candidate = candidates[k];
            if (candidate !== tileType) {
              newCandidates.push(candidate);
            }
          }
          candidates = newCandidates;
        }
      }
      return candidates[Math.floor(Math.random() * candidates.length)];
    };

    return Level;

  })();

  LevelBlock = (function() {
    function LevelBlock(level, settings1) {
      this.level = level;
      this.settings = settings1;
      this.createdElements = [];
      this.createdBindings = [];
    }

    LevelBlock.prototype.build = function(pos, index) {
      if (this.generated) {
        return;
      }
      if (this.x == null) {
        this.x = pos.x;
      }
      if (this.y == null) {
        this.y = pos.y;
      }
      this.generated = true;
      this.generate();
      return this._notifyEnterFunction(index);
    };

    LevelBlock.prototype._notifyEnterFunction = function(index) {
      return Crafty.e('2D, Canvas, Color, Collision').attr({
        x: this.x,
        y: this.y,
        w: 10,
        h: 800
      }).color('#FF00FF').onHit('ScrollFront', function() {
        if (!this.triggeredFront) {
          Crafty.trigger('EnterBlock', index);
          return this.triggeredFront = true;
        }
      }).onHit('ScrollWall', function() {
        this.destroy();
        return Crafty.trigger('LeaveBlock', index);
      });
    };

    LevelBlock.prototype.generate = function() {};

    LevelBlock.prototype.enter = function() {};

    LevelBlock.prototype.inScreen = function() {};

    LevelBlock.prototype.leave = function() {
      return this.clean();
    };

    LevelBlock.prototype.clean = function() {
      var b, e, j, k, len, len1, ref, ref1;
      ref = this.createdElements;
      for (j = 0, len = ref.length; j < len; j++) {
        e = ref[j];
        e.destroy();
      }
      this.createdElements = [];
      ref1 = this.createdBindings;
      for (k = 0, len1 = ref1.length; k < len1; k++) {
        b = ref1[k];
        Crafty.unbind(b.event, b.callback);
      }
      return this.createdBindings = [];
    };

    LevelBlock.prototype.add = function(x, y, element) {
      element.attr({
        x: this.x + x,
        y: this.y + y
      });
      return this.createdElements.push(element);
    };

    LevelBlock.prototype.bind = function(event, callback) {
      this.createdBindings.push({
        event: event,
        callback: callback
      });
      return Crafty.bind(event, callback);
    };

    return LevelBlock;

  })();

  this.Game.levelGenerator = new LevelGenerator;

  this.Game.LevelBlock = LevelBlock;

}).call(this);
