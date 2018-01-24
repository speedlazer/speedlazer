Crafty.c 'BattleShip',
  init: ->
    @requires '2D, WebGL, Tween, Choreography, ShipSolid, Collision,' +
      'Hideable, Flipable, Scalable, SunBlock, WaterSplashes'
    width = 37
    @attr(
      w: 32 * width
      h: 32 * 7
      z: 6
      waterRadius: 10
      minSplashDuration: 600
      defaultWaterCooldown: 400
      waterSplashSpeed: 700
      minOffset: -20
    )
    @_topX = 0
    @_bottomX = 0
    @_color = {
      _red: 128,
      _green: 0,
      _blue: 0
    }

    topParts = [
      'Start'
      'TopFlat'
      'TopFlat'
      'CabinEnd'
      'Cabin'
      'Cabin'
      'CabinStart'
      'TopFlat'
      'CabinEnd'
      'Cabin'
      'Cabin'
      'Cabin'
      'CabinStart'
      'End'
    ]
    @_addTopParts(p) for p in topParts

    bottomParts = [
      'BottomSpace'
      'BottomFlat'
      'BottomFlat'
      'BottomSpace'
      'BottomFlat'
      'BottomSpace'
    ]
    @_addBottomParts(p) for p in bottomParts

    @attach Crafty.e("2D, WebGL, aircraftCarrierRadar").attr(
      x: @x + (16 * 32)
      y: @y - (4 * 32)
      z: -10
    )

    @attach Crafty.e("2D, WebGL, aircraftCarrierAntenna").attr(
      x: @x + (18 * 32)
      y: @y - (5.5 * 32)
      z: -10
    ).flip('X')

    @attach Crafty.e("2D, WebGL, aircraftCarrierAntenna").attr(
      x: @x + (27 * 32)
      y: @y - (5.5 * 32)
      z: -10
    ).flip('X')

    @attach Crafty.e("2D, WebGL, aircraftCarrierAntenna").attr(
      x: @x + (30 * 32)
      y: @y - (5.5 * 32)
      z: -10
    ).flip('X')

    @hatch = Crafty.e('CarrierHatch').attr(
      x: @x + 10 * 32
      y: @y + 29
    )
    @attach(@hatch)

    @hatch2 = Crafty.e('CarrierHatch').attr(
      x: @x + 20 * 32
      y: @y + 29
    )
    @attach(@hatch2)


    @attach Crafty.e('2D, MineCannonPlace').attr(
      x: @x + 100
      y: @y + 44
      z: 15
      w: 15
      h: 2
    )

    @attach Crafty.e('2D, TurretPlace').attr(
      x: @x + 550
      y: @y + 44
      z: 15
      w: 15
      h: 2
    )

    @attach Crafty.e('2D, TurretPlace').attr(
      x: @x + 1050
      y: @y + 44
      z: 15
      w: 15
      h: 2
    )

    @collision [
      20, 60,
      32 * width, 60,
      32 * width, 188,
      20, 188
    ]

  _addTopParts: (name) ->
    cabin = ['CabinEnd', 'Cabin', 'CabinStart']
    flip = ['CabinEnd', 'CabinStart']

    width = {
      Start: 6
      TopFlat: 4
      CabinEnd: 2
      Cabin: 2
      CabinStart: 1
      End: 6
    }[name]

    y = 0
    y = -5 * 32 if name in cabin

    part = Crafty.e("2D, WebGL, aircraftCarrier#{name}").attr(
      x: @x + @_topX
      y: @y + y
      z: -13
    )

    part.flip('X') if name in flip
    if name in cabin
      part.addComponent('ColorEffects')
      part.addComponent('SunBlock')
      part.colorOverride(@_color, 'partial')

    @attach part
    @_topX += width * 32

  _addBottomParts: (name) ->
    width = {
      BottomFlat: 6
      BottomSpace: 3
    }[name]

    @attach Crafty.e("2D, WebGL, aircraftCarrier#{name}").attr(
      x: @x + (6 * 32) + @_bottomX
      y: @y + 64
      z: 3
    )

    @_bottomX += width * 32

  open: (hatch) ->
    @hatch.open() if 0 in hatch
    @hatch2.open() if 1 in hatch

  close: (hatch) ->
    @hatch.close() if 0 in hatch
    @hatch2.close() if 1 in hatch


  execute: (action) ->
    switch action
      when 'open1' then @open([0])
      when 'close1' then @close([0])
      when 'open2' then @open([1])
      when 'close2' then @close([1])
      when 'open' then @open([0,1])
      when 'close' then @close([0,1])
