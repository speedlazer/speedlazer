Crafty.c 'PowerUp',
  init: ->
    @requires '2D,WebGL,Color'
    @attr
      w: 22
      h: 22

  remove: ->

  powerUp: (@settings) ->
    if @settings.type
      typeColors =
        weapon: '#8080FF'
        weaponUpgrade: '#FFFF00'
        weaponBoost: '#00A000'
        ship: '#802020'

      @color typeColors[@settings.type]

    if @settings.marking
      size = '12px'
      pos = x: 5, y: 5
      if @settings.marking.length is 2
        size = '9px'
        pos = x: 3, y: 8
      marking = Crafty.e('2D,DOM,Text')
        .textColor('#000000')
        .textFont({
          size: size
          family: 'Press Start 2P'
        })
        .text(@settings.marking)
        .attr pos
      @attach marking
    this
