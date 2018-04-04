Crafty.c 'BattleShip',
  required: '2D, WebGL, Tween, Choreography, ShipSolid, Collision,' +
    'Hideable, Flipable, Scalable, SunBlock, WaterSplashes, ShipCabin, Sprite'

  init: ->
    width = 40
    @attr(
      w: 32 * width
      h: 32 * 7
      z: -20
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
      'TopFlat'
      'TopFlat'
      'TopFlat'
      'TopFlat'
      'TopFlat'
      'TopFlat'
      'End'
    ]
    for p in topParts
      @_topX += @_addTopParts(p, @_topX)

    bottomParts = [
      'BottomFlat'
      'BottomSpace'
      'BottomFlat'
      'BottomFlat'
      'BottomFlat'
      'BottomSpace'
      'BottomFlat'
      'BottomFlat'
    ]
    @_addBottomParts(p) for p in bottomParts

    @hatch = Crafty.e('CarrierHatch, ShipHatch1').attr(
      x: @x + 10 * 32
      y: @y + 29
      floorOffset: 75
    )
    @attach(@hatch)

    @hatch2 = Crafty.e('CarrierHatch, ShipHatch2').attr(
      x: @x + 16 * 32
      y: @y + 29
      floorOffset: 75
    )
    @attach(@hatch2)

    @hatch3 = Crafty.e('CarrierHatch, ShipHatch3').attr(
      x: @x + 22 * 32
      y: @y + 29
      floorOffset: 75
    )
    @attach(@hatch3)

    @attach Crafty.e('2D, Cabin1Place').attr(
      x: @x + 290
      y: @y + 100
      z: -8
      w: 15
      h: 2
    )

    @attach Crafty.e('2D, HeliPlace').attr(
      x: @x + 561
      y: @y - 32
      z: -8
      w: 15
      h: 2
    )
    @attach Crafty.e('2D, HeliPlace').attr(
      x: @x + 686
      y: @y - 32
      z: -8
      w: 15
      h: 2
    )

    @attach Crafty.e('2D, Cabin2Place').attr(
      x: @x + 816
      y: @y + 100
      z: -8
      w: 15
      h: 2
    )

    @attach Crafty.e('2D, DroneShipCorePlace').attr(
      x: @x + 900
      y: @y - 25
      z: -8
      w: 15
      h: 2
    )

    @collision [
      20, 60,
      32 * width, 60,
      32 * width, 188,
      20, 188
    ]


  _addBottomParts: (name) ->
    width = {
      BottomFlat: 4
      BottomSpace: 4
    }[name]

    @attach Crafty.e("2D, WebGL, Hideable, aircraftCarrier#{name}").attr(
      x: @x + (6 * 32) + @_bottomX
      y: @y + 64
      z: -8
    )

    @_bottomX += width * 32

  ship: () ->
    @hatch.hatch('HatchFloor1')
    @hatch2.hatch('HatchFloor2')
    @hatch3.hatch('HatchFloor3')
    return this

  open: (hatch) ->
    @hatch.open() if 0 in hatch
    @hatch2.open() if 1 in hatch
    @hatch3.open() if 2 in hatch

  close: (hatch) ->
    @hatch.close() if 0 in hatch
    @hatch2.close() if 1 in hatch
    @hatch3.close() if 2 in hatch


  execute: (action, index = 'all') ->
    switch action
      when 'open'
        if index == 'all'
          @open([0,1,2])
        else
          @open([index])
      when 'close'
        if index == 'all'
          @close([0,1,2])
        else
          @close([index])
      when 'activateCannon'
        Crafty("Turret#{index + 1}").trigger('Activate')
      when 'deactivateCannon'
        Crafty("Turret#{index + 1}").trigger('Deactivate')

Crafty.c 'ShipCabin', {
  init: ->
    @cabinParts = []

  _addTopParts: (name, x, dy = @y) ->
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
      x: @x + x
      y: dy + y
      z: -15
    )

    part.flip('X') if name in flip
    topCrop = 2
    if name in cabin
      part.attr(
        z: -8
        y: dy + y + 2
      )
      part.addComponent('ColorEffects')
      part.addComponent('SunBlock')
      part.crop(0, topCrop, part.w, part.h - topCrop)
      part.shift(0, 2)
      part.colorOverride(@_color, 'partial')

    @cabinParts.push part
    @attach part
    return width * 32

  _replaceByDestroyed: ->
    for p in @cabinParts
      if p.has('aircraftCarrierCabinStart')
        p.sprite(14, 37)
      if p.has('aircraftCarrierCabinEnd')
        p.sprite(19, 37)
      if p.has('aircraftCarrierCabinRadar')
        p.sprite(15, 37)
      if p.has('aircraftCarrierCabin')
        p.sprite(17, 37)
      p.crop(0, 32 * 3, p.w, p.h - (3 * 32))
      p.shift(0, 3 * 32)

}

Crafty.c 'FirstShipCabin', {
  required: 'Enemy, ShipCabin'

  init: ->
    @_color = {
      _red: 128,
      _green: 0,
      _blue: 0
    }

    @attr(
      w: 10
      h: 10
      z: -8
      health: 2000
    )
    @hitBox = Crafty.e('2D, WebGL, Collision')
    @hitBox.attr(
      x: @x + 10
      y: @y - 100 - 110
      w: 200
      h: 130
    )
    cabin1 = [
      'CabinEnd'
      'Cabin'
      'Cabin'
      'CabinStart'
    ]
    c1x = 0
    for p in cabin1
      c1x += @_addTopParts(p, c1x, @y - 100)
    @radar = Crafty.e("2D, WebGL, aircraftCarrierRadar").attr(
      x: @x + (2 * 32)
      y: @y - (4 * 32) - 100
      z: -8
    )
    @attach @radar

    @antenna = Crafty.e("2D, WebGL, aircraftCarrierAntenna").attr(
      x: @x + (4 * 32)
      y: @y - (5.5 * 32) - 100
      z: -8
    ).flip('X')
    @attach @antenna

    @attach(@hitBox)
    @bind 'HitFlash', @applyCabinHitFlash

  shipCabin: ->
    @hitBox.onHit(
      'Bullet',
      (e) => @trigger('HitOn', e)
      (c) => @trigger('HitOff', c)
    )
    @hitBox.onHit(
      'Explosion'
      (e) => @trigger('HitOn', e)
      (c) => @trigger('HitOff', c)
    )

    @hitParts = [@cabinParts..., @antenna, @radar]

    @enemy({
      pointsLocation: {
        x: 3 * 32
        y: - (5 * 32)
      }
    })

  linkHatch: (linkedHatch) ->
    @hitParts = @hitParts.concat(linkedHatch.hitFlashParts())
    this

  applyCabinHitFlash: (onOff) ->
    @hitParts.forEach((part) ->
      if onOff
        part.attr hitFlash: { _red: 255, _green: 255, _blue: 255 }
      else
        part.attr hitFlash: no
    )

  updatedHealth: ->
    healthPerc = @health / @maxHealth
    if @health == 1
      @antenna.alpha = 0
      @radar.alpha = 0
      @_replaceByDestroyed()
}

Crafty.c 'SecondShipCabin', {
  required: 'Enemy, ShipCabin'

  init: ->
    @_color = {
      _red: 128,
      _green: 0,
      _blue: 0
    }

    @attr(
      w: 10
      h: 10
      z: -8
      health: 4000
    )
    @hitBox = Crafty.e('2D, WebGL, Collision')
    @hitBox.attr(
      x: @x + 10
      y: @y - 100 - 110
      w: 200
      h: 130
    )
    cabin1 = [
      'CabinEnd'
      'Cabin'
      'Cabin'
      'Cabin'
      'CabinStart'
    ]
    c1x = 0
    for p in cabin1
      c1x += @_addTopParts(p, c1x, @y - 100)
    @antenna1 = Crafty.e("2D, WebGL, aircraftCarrierAntenna").attr(
      x: @x + (2 * 32)
      y: @y - (5.5 * 32) - 100
      z: -8
    ).flip('X')
    @attach @antenna1

    @antenna2 = Crafty.e("2D, WebGL, aircraftCarrierAntenna").attr(
      x: @x + (5 * 32)
      y: @y - (5.5 * 32) - 100
      z: -8
    ).flip('X')
    @attach @antenna2

    @attach(@hitBox)
    @bind 'HitFlash', @applyCabinHitFlash

  shipCabin: ->
    @hitBox.onHit(
      'Bullet',
      (e) => @trigger('HitOn', e)
      (c) => @trigger('HitOff', c)
    )
    @hitBox.onHit(
      'Explosion'
      (e) => @trigger('HitOn', e)
      (c) => @trigger('HitOff', c)
    )

    @hitParts = [@cabinParts..., @antenna1, @antenna2]

    @enemy({
      pointsLocation: {
        x: 3 * 32
        y: - (5 * 32)
      }
    })

  linkHatch: (linkedHatch) ->
    @hitParts = @hitParts.concat(linkedHatch.hitFlashParts())
    this

  applyCabinHitFlash: (onOff) ->
    @hitParts.forEach((part) ->
      if onOff
        part.attr hitFlash: { _red: 255, _green: 255, _blue: 255 }
      else
        part.attr hitFlash: no
    )

  updatedHealth: ->
    healthPerc = @health / @maxHealth
    if @health == 1
      @antenna1.alpha = 0
      @antenna2.alpha = 0
      @_replaceByDestroyed()

}
