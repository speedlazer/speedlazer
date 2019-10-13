Crafty.c 'PowerUp',
  init: ->
    @requires '2D, WebGL, ColorEffects, powerUpBox, SpriteAnimation, TweenPromise, Scalable, ViewportRelativeMotion'
    @reel 'blink', 600, [[10, 1], [11, 1], [12, 1], [11, 1]]
    @attr
      w: 32
      h: 32
    @pickedUp = no

  remove: ->

  powerUp: (@settings) ->
    @animate 'blink', -1
    color = '#802020'
    if @settings.type
      typeColors =
        weapon: '#202080'
        weaponBoost: '#D06000'
        weaponUpgrade: '#30B030'
        ship: '#802020'
        shipUpgrade: '#30B030'
        shipBoost: '#D06000'

      color = typeColors[@settings.type]
    @colorOverride color, 'partial'

    if @settings.icon
      marking = Crafty.e('2D,WebGL,ColorEffects')
        .addComponent(@settings.icon)
        .colorOverride('white', 'partial')
        .attr w: 22, h: 22, x: @x + 5, y: @y + 5
      @attach marking
    else
      if @settings.marking
        size = '16px'
        pos = x: @x + 8, y: @y + 8
        if @settings.marking.length is 2
          size = '9px'
          pos = x: @x + 3, y: @y + 8
        marking = Crafty.e('2D,DOM,Text')
          .textColor('#FFF')
          .textFont({
            size: size
            family: 'Press Start 2P'
          })
          .text(@settings.marking)
          .attr pos
        @attach marking
    @viewportRelativeMotion({ speed: 1 })
    this

  pickup: ->
    @pickedUp = yes
    @tweenPromise(
      scale: 1.5,
      x: @x - 12,
      y: @y - 12,
      120
    ).then =>
      @tweenPromise(
        alpha: 0,
        scale: .3,
        z: 20,
        x: @x + 15,
        y: @y + 15,
        120
      ).then => @destroy()
