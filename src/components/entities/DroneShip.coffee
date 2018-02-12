Crafty.c 'DroneShip',
  init: ->
    @requires '2D, WebGL, Tween, Choreography, ShipSolid, Collision,' +
      'Hideable, Flipable, Scalable, SunBlock, WaterSplashes'
    @attr(
      w: 32 * 20
      h: 32 * 5
      z: 6
      waterRadius: 8
      minSplashDuration: 1700
      defaultWaterCooldown: 800
      waterSplashSpeed: 700
      minOffset: 2
      splashUpwards: false
    )
    @collision [20, 50, 19*32, 50, 19*32, 128, 20, 128]

    start = Crafty.e('2D, WebGL, aircraftCarrierStart').attr(
      x: @x
      y: @y
      z: -13
    )
    @attach(start)

    radar = Crafty.e('2D, WebGL, aircraftCarrierRadar').attr(
      x: @x + 8 * 32
      y: @y - 24
      z: -12
    )
    @attach(radar)

    @attach Crafty.e("2D, WebGL, aircraftCarrierBottomFlat").attr(
      x: @x + 6 * 32
      y: @y + 64
      z: -15
    )

    @attach Crafty.e("2D, WebGL, aircraftCarrierTopFlat").attr(
      x: @x + 6 * 32
      y: @y
      z: -15
    )

    @attach Crafty.e("2D, WebGL, aircraftCarrierBottomSpace").attr(
      x: @x + 10 * 32
      y: @y + 64
      z: -15
    )

    @attach Crafty.e("2D, WebGL, aircraftCarrierTopFlat").attr(
      x: @x + 10 * 32
      y: @y
      z: -15
    )

    end = Crafty.e('2D, WebGL, aircraftCarrierEnd').attr(
      x: @x + 14 * 32
      y: @y
      z: -15
    )
    @attach(end)

    @hatch = Crafty.e('CarrierHatch, ShipHatch1').attr(
      x: @x + 3 * 32
      y: @y + 29
    )
    @attach(@hatch)

    @attach Crafty.e('2D, TurretPlace').attr(
      x: @x + 370
      y: @y + 84
      z: 15
      w: 15
      h: 2
    )

  open: ->
    @hatch.open()

  close: ->
    @hatch.close()

  execute: (action) ->
    switch action
      when 'open' then @open()
      when 'close' then @close()

