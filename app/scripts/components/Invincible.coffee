Crafty.c 'Invincible',
  init: ->
    @requires 'Delay'

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
    @delay(@_blink, 250, -1)
    return this if duration is -1
    @delay(->
      @removeComponent('Invincible')
    , duration, 0)
    this

