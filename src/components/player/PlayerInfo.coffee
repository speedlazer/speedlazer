Crafty.c 'PlayerInfo',
  init: ->
    @requires '2D, Listener'
    @boosts = {}
    @visible = yes

  playerInfo: (x, player) ->
    @player = player
    @displayedScore = player.points
    @score = Crafty.e('2D, Text, UILayerDOM')
      .attr(
        w: 220, h: 20
        x: x, y: 10, z: 200
      )
      .textFont(
        size: '10px'
        family: 'Press Start 2P'
      )
    if @player.has('Color')
      @score.textColor @player.color()

    @lives = Crafty.e('2D, Text, UILayerDOM')
      .attr(
        w: 220, h: 20
        x: x, y: 30, z: 200
      )
      .textFont(
        size: '10px'
        family: 'Press Start 2P'
      )
    @health = Crafty.e('2D, Text, UILayerDOM')
      .attr(
        w: 220, h: 20
        x: x + 70, y: 28, z: 200
      )
      .textFont(
        size: '10px'
        family: 'Press Start 2P'
      )
    @heart = Crafty.e('2D, ColorEffects, heart, UILayerWebGL')
      .attr(
        w: 16, h: 16
        x: x - 2, y: 26, z: 200
      )
      .colorOverride(player.color(), 'partial')

    if @player.has('Color')
      @lives.textColor player.color()
      @health.textColor player.color()

    @updatePlayerInfo()
    @createBoostsVisuals(x)

    @listenTo player, 'GameLoop', (fd) =>
      @updatePlayerInfo()
      @updateBoostInfo()
      @updateHealthInfo(fd)
    this

  setVisibility: (visibility) ->
    @visible = visibility

  createBoostsVisuals: (x) ->
    playerColor = @player.color()
    @boosts['speedb'] = Crafty.e('2D, UILayerWebGL, speedBoost, ColorEffects')
      .attr(w: 16, h: 16)
      .attr(x: x, y: 45, z: 200)
      .colorOverride(playerColor, 'partial')
    @boosts['rapidb'] = Crafty.e('2D, UILayerWebGL, rapidFireBoost, ColorEffects')
      .attr(w: 16, h: 16)
      .attr(x: x + 20, y: 44, z: 200)
      .colorOverride(playerColor, 'partial')
    @boosts['aimb'] = Crafty.e('2D, UILayerWebGL, aimBoost, ColorEffects')
      .attr(w: 16, h: 16)
      .attr(x: x + 40, y: 44, z: 200)
      .colorOverride(playerColor, 'partial')
    @boosts['damageb'] = Crafty.e('2D, UILayerWebGL, damageBoost, ColorEffects')
      .attr(w: 16, h: 16)
      .attr(x: x + 50, y: 44, z: 200)
      .colorOverride(playerColor, 'partial')

  updateBoostInfo: ->
    e.attr(alpha: 0) for n, e of @boosts
    return unless @player.has('ControlScheme')
    return if @visibile is no
    if @player.ship?
      stats = @player.ship.stats()
      for boost, timing of stats.primary.boostTimings
        alpha = 1
        if timing < 2000
          alpha = 0 if Math.floor(timing / 200) % 2 is 0
        @boosts[boost].attr(alpha: alpha)

  updateHealthInfo: (fd) ->
    @health.attr(alpha: 0)
    return unless @player.has('ControlScheme')
    return if @visibile is no
    if @player.ship?
      alpha = 1
      if @player.health < 1
        alpha = 0 if Math.floor(fd.inGameTime / 200) % 2 is 0
      @health.attr(alpha: alpha)

  updatePlayerInfo: ->
    if @displayedScore < @player.points
      @displayedScore += 1

    if @player.has('ControlScheme')
      @score.text('Score: ' + @displayedScore)
    else
      @score.text(@player.name)

    if @player.has('ControlScheme')
      if @player.lives is 0
        @lives.text('Game Over')
        @heart.attr(alpha: 0, visible: no)
        @health.attr(alpha: 0, visible: no)
        # TODO: Add continue? with time counter
      else
        @heart.attr(alpha: 1) if @visibile is yes
        @heart.attr(visible: yes)
        text = (@player.lives - 1)
        if text is Infinity
          text = 'Demo mode'
        @lives.text('&nbsp;  ' + text)

        health = Array(Math.max(1, @player.health)).fill('▩').join('')
        @health.attr(alpha: 1) if @visibile is yes
        @health.text(health)
    else
      @lives.text('Press fire to start!')
      @heart.attr(alpha: 0, visible: no)
      @health.attr(alpha: 0, visible: no)
      e.attr(alpha: 0) for n, e of @boosts

