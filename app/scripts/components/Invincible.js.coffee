Crafty.c 'Invincible',
  init: ->
    @requires 'Delay, Color'

    @rawColor = @color()
    @delay(@_blink, 250, -1)

  _blink: ->
    @blinkOn = true unless @blinkOn?

    @blinkOn = !@blinkOn
    if @blinkOn
      @color(@rawColor, 0.5)
    else
      @color(@rawColor, 100.0)

  remove: ->
    @color @rawColor
    @cancelDelay @_blink

  invincibleDuration: (duration) ->
    @delay(->
      @removeComponent('Invincible')
    , duration, 0)

