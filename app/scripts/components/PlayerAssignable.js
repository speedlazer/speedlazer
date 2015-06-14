'use strict';

Crafty.c('PlayerAssignable', {
  init: function () {
    this.one('Fire', this._assignControls);
    this.preferredPlayer = null;
  },
  _assignControls: function () {
    var player = this._playerWithoutControls(this.preferredPlayer);
    if (player === undefined) {
      // Try again next time
      this.one('Fire', this._assignControls);
      return;
    }
    this.preferredPlayer = player.getId();

    this.setupControls(player);
    var _this = this;
    player.one('Deactivated', function () {
      _this.one('Fire', _this._assignControls);
    });
  },
  _playerWithoutControls: function (preferred) {
    if (preferred !== null) {
      var preferredPlayer = Crafty(preferred);
      if (!preferredPlayer.has('ControlScheme')) {
        return preferredPlayer;
      }
    }
    var players = Crafty('Player');
    for (var i = 0; i < players.length; i++) {
      var player = Crafty(players[i]);
      if (!player.has('ControlScheme')) {
        return player;
      }
    }
  }
});

Crafty.c('ControlScheme', {
  init: function () {
    this.trigger('Activated');
    Crafty.trigger('PlayerActivated');
  },
  remove: function () {
    this.trigger('Deactivated');
    Crafty.trigger('PlayerDeactivated');
  }
});
