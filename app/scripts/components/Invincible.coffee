Crafty.c 'Invincible',
  init: ->
    @requires 'Delay'

    @delay(@_blink, 250, -1)

  _blink: ->
    @blinkOn = true unless @blinkOn?

    @blinkOn = !@blinkOn
    if @blinkOn
      @alpha = .5
    else
      @alpha = 1.0

  remove: ->
    @cancelDelay @_blink

  invincibleDuration: (duration) ->
    @delay(->
      @removeComponent('Invincible')
    , duration, 0)

