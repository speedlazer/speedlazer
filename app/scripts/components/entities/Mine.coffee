Crafty.c 'Mine',
  init: ->
    @requires 'Enemy, standardMine, SpriteAnimation'
    @reel 'open', 200, [[1, 0], [2, 0]]
    @reel 'close', 200, [[1, 0], [0, 0]]
    @reel 'blink', 100, [[2, 0], [3, 0]]

    @bind 'GameLoop', (fd) ->
      delta = (360 / 4000) * fd.dt
      @attr rotation: @rotation + delta


  mine: (attr = {}) ->
    @attr _.defaults(attr, h: 25, w: 25, health: 200)
    @origin 'center'

    @enemy()
    this
