Crafty.c 'Mine',
  init: ->
    # TODO: Try out a sprite sheet with powers of 2 dimensions for WebGL
    Crafty.sprite(25, 25, "images/mine.png", {
      standardMine: [0,0]
    }, 1)

    @requires 'Enemy, standardMine, SpriteAnimation'
    @reel 'open', 200, [[1, 0], [2, 0]]
    @reel 'close', 200, [[1, 0], [0, 0]]
    @reel 'blink', 100, [[2, 0], [3, 0]]

    @bind 'EnterFrame', (fd) ->
      delta = (360 / 4000) * fd.dt
      @attr rotation: @rotation + delta


  mine: (attr = {}) ->
    @attr _.defaults(attr, h: 25, w: 25, health: 200)
    @origin 'center'

    @enemy()
    this
