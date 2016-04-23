Crafty.c 'PowerUp',
  init: ->
    @requires '2D,WebGL,Color'
    @attr
      w: 20
      h: 20

  remove: ->

  powerUp: (@settings) ->
    if @settings.type
      typeColors =
        weapon: '#8080FF'
        weaponUpgrade: '#20FF20'
        weaponBoost: '#208020'

      @color typeColors[@settings.type]

    if @settings.marking
      marking = Crafty.e('2D,DOM,Text')
        .textColor('#000000')
        .textFont({
          size: '12px'
          family: 'Press Start 2P'
        })
        .text(@settings.marking)
        .attr x: 4, y: 4
      @attach marking
    this
