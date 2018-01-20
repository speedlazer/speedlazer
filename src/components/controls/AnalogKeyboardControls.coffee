Crafty.c 'AnalogKeyboardControls',
  init: ->
    @requires 'Listener'
    @bind 'RemoveComponent', (componentName) ->
      @removeComponent('AnalogKeyboardControls') if componentName is 'ControlScheme'

  remove: ->
    @unbind('KeyDown', @_keyHandling)

  setupControls: (player) ->
    player.addComponent('AnalogKeyboardControls')
      .controls(@controlMap)
      .addComponent('ControlScheme')

  controls: (controlMap) ->
    @controlMap = controlMap
    @bind('KeyDown', @_keyHandling)
    this

  _keyHandling: (e) ->
    if e.key is @controlMap.fire
      @trigger('Fire', e)
    if e.key is @controlMap.up
      @trigger('Up', e)
    if e.key is @controlMap.down
      @trigger('Down', e)
    if e.key is @controlMap.left
      @trigger('Left', e)
    if e.key is @controlMap.right
      @trigger('Right', e)

  assignControls: (ship) ->
    controlMap = @controlMap

    MAX_X_SPEED = 500
    MAX_Y_SPEED = 500
    ACCELLERATE_Y = MAX_Y_SPEED * 5
    ACCELLERATE_X = MAX_X_SPEED * 5

    yDir = 0
    xDir = 0

    ship.addComponent('Keyboard, Motion')
      .bind('GamePause', (paused) ->
        if paused
          @disabledBeforePause = @disableControls
          @disableControl()
        else
          @enableControl() unless @disabledBeforePause
      )
      .bind('Move', ->
        yLimit = MAX_Y_SPEED * yDir
        if (@vy < yLimit and yLimit <= 0 and @ay < 0) or (@vy > yLimit and yLimit >= 0 and @ay > 0)
          @vy = yLimit
          @ay = 0

        xLimit = MAX_X_SPEED * xDir
        if (@vx < xLimit and xLimit <= 0 and @ax < 0) or (@vx > xLimit and xLimit >= 0 and @ax > 0)
          @vx = xLimit
          @ax = 0
      )

    ship.disableControls = false
    ship.prevSets = {
      ax: ship.ax,
      ay: ship.ay,
      vx: ship.vx,
      vy: ship.vy
    }
    ship.disableControl = ->
      return if @disableControls == true
      @disableControls = true
      @prevSets = {
        @ax, @ay,
        @vx, @vy
      }
      @ax = 0
      @ay = 0
      @vx = 0
      @vy = 0
      xDir = 0
      yDir = 0

    ship.enableControl = ->
      return if @disableControls == false
      @disableControls = false
      @ax = @prevSets.ax
      @ay = @prevSets.ay
      @vx = @prevSets.vx
      @vy = @prevSets.vy

    @listenTo ship, 'KeyDown', (e) ->
      Game.togglePause() if e.key is controlMap.pause

      return if ship.disableControls
      ship.shoot(true) if e.key is controlMap.fire
      ship.switchWeapon(true) if e.key is controlMap.switchWeapon
      ship.superWeapon(true) if e.key is controlMap.super

      yDir -= 1 if e.key is controlMap.up
      yDir += 1 if e.key is controlMap.down
      yDir = Math.min(1, Math.max(-1, yDir))
      ship.ay += (ACCELLERATE_Y * yDir)
      if (ship.vy > 0 and ship.ay == 0) # decellerate
        ship.ay -= (ACCELLERATE_Y * 2)
      if (ship.vy < 0 and ship.ay == 0) # decellerate
        ship.ay += (ACCELLERATE_Y * 2)

      xDir -= 1 if e.key is controlMap.left
      xDir += 1 if e.key is controlMap.right
      xDir = Math.min(1, Math.max(-1, xDir))
      ship.ax += (ACCELLERATE_X * xDir)
      if (ship.vx > 0 and ship.ax == 0) # decellerate
        ship.ax -= (ACCELLERATE_X * 2)
      if (ship.vx < 0 and ship.ax == 0) # decellerate
        ship.ax += (ACCELLERATE_X * 2)

    @listenTo ship, 'KeyUp', (e) ->
      return if ship.disableControls
      ship.shoot(false) if e.key is controlMap.fire
      ship.switchWeapon(false) if e.key is controlMap.switchWeapon
      ship.superWeapon(false) if e.key is controlMap.super

      yDir += 1 if e.key is controlMap.up
      yDir -= 1 if e.key is controlMap.down
      yDir = Math.min(1, Math.max(-1, yDir))
      ship.ay += (ACCELLERATE_Y * yDir)
      if (ship.vy > 0 and ship.ay == 0) # decellerate
        ship.ay -= (ACCELLERATE_Y * 2)
      if (ship.vy < 0 and ship.ay == 0) # decellerate
        ship.ay += (ACCELLERATE_Y * 2)

      xDir += 1 if e.key is controlMap.left
      xDir -= 1 if e.key is controlMap.right
      xDir = Math.min(1, Math.max(-1, xDir))
      ship.ax += (ACCELLERATE_X * xDir)
      if (ship.vx > 0 and ship.ax == 0) # decellerate
        ship.ax -= (ACCELLERATE_X * 2)
      if (ship.vx < 0 and ship.ax == 0) # decellerate
        ship.ax += (ACCELLERATE_X * 2)
