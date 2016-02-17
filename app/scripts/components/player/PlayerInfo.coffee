Crafty.c 'PlayerInfo',
  init: ->
    @requires '2D, Listener'

  playerInfo: (x, player) ->
    @player = player
    @score = Crafty.e('2D, DOM, Text, HUD')
      .attr(w: 220, h: 20)
      .positionHud(x: x, y: 10, z: 2)
      .textFont(
        size: '10px'
        family: 'Press Start 2P'
      )
    if @player.has('Color')
      @score.textColor @player.color()

    @lives = Crafty.e('2D, DOM, Text, HUD')
      .attr(w: 220, h: 20)
      .positionHud(x: x, y: 30, z: 2)
      .textFont(
        size: '10px'
        family: 'Press Start 2P'
      )
    if @player.has('Color')
      @lives.textColor player.color()

    @updatePlayerInfo()

    @listenTo player, 'UpdateLives', @updatePlayerInfo
    @listenTo player, 'UpdatePoints', @updatePlayerInfo
    @listenTo player, 'Activated', =>
      @updatePlayerInfo()
    @listenTo player, 'Deactivated', =>
      @updatePlayerInfo()
    this

  updatePlayerInfo: ->
    if @player.has('ControlScheme')
      @score.text('Score: ' + @player.points)
    else
      @score.text(@player.name)

    if @player.has('ControlScheme')
      if @player.lives is 0
        @lives.text('Game Over')
      else
        @lives.text('Lives: ' + (@player.lives - 1))
    else
      @lives.text('Press fire to start!')
