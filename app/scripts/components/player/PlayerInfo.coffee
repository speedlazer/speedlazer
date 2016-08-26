Crafty.c 'PlayerInfo',
  init: ->
    @requires '2D, Listener'
    @boosts = {}

  playerInfo: (x, player) ->
    @player = player
    @score = Crafty.e('2D, DOM, Text, HUD')
      .attr(w: 220, h: 20)
      .positionHud(x: x, y: 10, z: 200)
      .textFont(
        size: '10px'
        family: 'Press Start 2P'
      )
    if @player.has('Color')
      @score.textColor @player.color()

    @lives = Crafty.e('2D, DOM, Text, HUD')
      .attr(w: 220, h: 20)
      .positionHud(x: x, y: 30, z: 200)
      .textFont(
        size: '10px'
        family: 'Press Start 2P'
      )
    @heart = Crafty.e('2D, WebGL, ColorEffects, heart, HUD')
      .attr(w: 16, h: 16)
      .positionHud(x: x - 2, y: 26, z: 200)
      .colorOverride(player.color(), 'partial')

    if @player.has('Color')
      @lives.textColor player.color()

    @updatePlayerInfo()
    @createBoostsVisuals(x)

    @listenTo player, 'UpdateLives', @updatePlayerInfo
    @listenTo player, 'UpdatePoints', @updatePlayerInfo
    @listenTo player, 'Activated', => @updatePlayerInfo()
    @listenTo player, 'Deactivated', => @updatePlayerInfo()
    @listenTo player, 'GameLoop', => @updateBoostInfo()
    this

  createBoostsVisuals: (x) ->
    playerColor = @player.color()
    @boosts['speedb'] = Crafty.e('2D, WebGL, speedBoost, ColorEffects, HUD')
      .attr(w: 16, h: 16)
      .positionHud(x: x + 50, y: 29, z: 200)
      .colorOverride(playerColor, 'partial')
    @boosts['rapidb'] = Crafty.e('2D, WebGL, rapidFireBoost, ColorEffects, HUD')
      .attr(w: 16, h: 16)
      .positionHud(x: x + 70, y: 28, z: 200)
      .colorOverride(playerColor, 'partial')
    @boosts['aimb'] = Crafty.e('2D, WebGL, aimBoost, ColorEffects, HUD')
      .attr(w: 16, h: 16)
      .positionHud(x: x + 90, y: 28, z: 200)
      .colorOverride(playerColor, 'partial')
    @boosts['damageb'] = Crafty.e('2D, WebGL, damageBoost, ColorEffects, HUD')
      .attr(w: 16, h: 16)
      .positionHud(x: x + 110, y: 28, z: 200)
      .colorOverride(playerColor, 'partial')

  updateBoostInfo: ->
    e.attr(alpha: 0) for n, e of @boosts
    return unless @player.has('ControlScheme')
    if @player.ship?
      stats = @player.ship.stats()
      for boost, timing of stats.primary.boostTimings
        alpha = 1
        if timing < 2000
          alpha = 0 if Math.floor(timing / 200) % 2 is 0
        @boosts[boost].attr(alpha: alpha)

  updatePlayerInfo: ->
    if @player.has('ControlScheme')
      @score.text('Score: ' + @player.points)
    else
      @score.text(@player.name)

    if @player.has('ControlScheme')
      if @player.lives is 0
        @lives.text('Game Over')
        @heart.attr(alpha: 0)
        # TODO: Add continue? with time counter
      else
        @heart.attr(alpha: 1)
        text = (@player.lives - 1)
        if text is Infinity
          text = 'Demo mode'
        @lives.text('&nbsp;  ' + text)
    else
      @lives.text('Press fire to start!')
      @heart.attr(alpha: 0)
      e.attr(alpha: 0) for n, e of @boosts
