
MOVE_X = -32
MOVE_Y = 16

Crafty.c('CarrierHatch', {
  init: ->
    @requires '2D, WebGL, aircraftCarrierOpenHatch'
    @attr(z: -10)
    @crop 0, 2, 5*32, 32

    @lid = Crafty.e('2D, WebGL, aircraftCarrierHatchLid, Tween, Delta2D')
    @lid.crop 0, 2, 5*32, 32
    @lid.attr(
      z: -9
      x: @x
      y: @y
    )
    @attach(@lid)

    @dust = Crafty.e('2D, WebGL, Explode, ColorEffects')
    @dust.colorOverride('#808080')
    @dust.attr(
      w: 150,
      alpha: 0,
      h: 30
      x: @x
      y: @y
    )
    @attach(@dust)

  open: ->
    @dust.alpha = .2
    @lid.attr(dy: 0, dx: 0)
    @lid.tween(
      {
        dx: MOVE_X
        dy: MOVE_Y
      },
      600,
      'easeInOutQuad'
    )
    @dust.one('TweenEnd', =>
      @dust.alpha = 0
    )
    @dust.playExplode(800)

  close: ->
    @lid.attr(
      dx: MOVE_X
      dy: MOVE_Y
    )
    @lid.tween(
      {
        dy: 0
        dx: 0
      },
      600,
      'easeInOutQuad'
    )
    @lid.one('TweenEnd', =>
      @dust.alpha = .2
      @dust.one('AnimationEnd', =>
        @dust.alpha = 0
      )
      @dust.playExplode(800)
    )

})
