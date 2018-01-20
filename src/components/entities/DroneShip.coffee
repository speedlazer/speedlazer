Crafty.c 'DroneShip',
  init: ->
    @requires '2D, WebGL, Tween, Choreography, ShipSolid, Collision,' +
      'Hideable, Flipable, Scalable, SunBlock, WaterSplashes'
    @attr(
      w: 32 * 12
      h: 32 * 5
      z: 6
      waterRadius: 8
      minSplashDuration: 1700
      defaultWaterCooldown: 800
      waterSplashSpeed: 700
      minOffset: 2
      splashUpwards: false
    )
    @collision [20, 50, 11*32, 50, 11*32, 128, 20, 128]

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

    end = Crafty.e('2D, WebGL, aircraftCarrierEnd').attr(
      x: @x + 6 * 32
      y: @y
      z: -13
    )
    @attach(end)

    start2 = Crafty.e('2D, WebGL, aircraftCarrierStart').attr(
      x: @x
      y: @y + 60
      z: 3
    ).crop(0, 60, 6*32, 5*32)
    @attach(start2)
    end2 = Crafty.e('2D, WebGL, aircraftCarrierEnd').attr(
      x: @x + 6 * 32
      y: @y + 60
      z: 3
    ).crop(0, 60, 6*32, 5*32)
    @attach(end2)

    @hatch = Crafty.e('carrierHatch').attr(
      x: @x + 3 * 32
      y: @y + 28
      z: -5
    )
    @attach(@hatch)

  open: ->
    @hatch.animate('open')

  close: ->
    @hatch.animate('close')

  execute: (action) ->
    switch action
      when 'open' then @open()
      when 'close' then @close()

