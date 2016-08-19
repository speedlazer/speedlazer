Crafty.c 'PowerUp',
  init: ->
    @requires '2D, WebGL, ColorEffects, powerUpBox, SpriteAnimation'
    @reel 'blink', 600, [[10, 1], [11, 1], [12, 1], [11, 1]]
    @attr
      w: 32
      h: 32

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

      color = typeColors[@settings.type]
    @colorOverride color, 'partial'

    if @settings.icon
      marking = Crafty.e('2D,WebGL,ColorEffects')
        .addComponent(@settings.icon)
        .colorOverride('white', 'partial')
        .attr w: 22, h: 22, x: 5, y: 5
      @attach marking
    else
      if @settings.marking
        size = '16px'
        pos = x: 8, y: 8
        if @settings.marking.length is 2
          size = '9px'
          pos = x: 3, y: 8
        marking = Crafty.e('2D,DOM,Text')
          .textColor('#FFF')
          .textFont({
            size: size
            family: 'Press Start 2P'
          })
          .text(@settings.marking)
          .attr pos
        @attach marking
    this
