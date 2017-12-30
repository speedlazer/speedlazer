Crafty.c 'GamepadControls',
  init: ->
    @requires 'Listener'
    @bind 'RemoveComponent', (componentName) ->
      @removeComponent 'GamepadControls' if componentName is 'ControlScheme'
    @emits = {}

  remove: ->
    @unbind 'GamepadKeyChange', @_keyHandling

  setupControls: (player) ->
    player.addComponent('GamepadControls')
      .controls(@controlMap)
      .addComponent('ControlScheme')

  controls: (controlMap) ->
    @controlMap = controlMap
    return unless controlMap.gamepadIndex?

    @requires 'Gamepad'
    @gamepad controlMap.gamepadIndex

    @bind 'GamepadKeyChange', @_keyHandling
    @bind 'GamepadAxisChange', @_stickHandling
    this

  _stickHandling: (e) ->
    # TODO: Detect start motion, start emitting 'up / down', 'left / right'
    # Detect end motion
    #
    #   axis: j,
    #   value: gamepad.axes[j]
    if e.axis is 1 # left stick: up / down
      direction = 'vertical'
      if e.value < -0.5
        @_startEmit(direction, 'Up')
      else if e.value > 0.5
        @_startEmit(direction, 'Down')
      else
        @_stopEmit(direction)

    if e.axis is 0 # left stick: left / right
      direction = 'horizontal'
      if e.value < -0.5
        @_startEmit(direction, 'Left')
      else if e.value > 0.5
        @_startEmit(direction, 'Right')
      else
        @_stopEmit(direction)

  _startEmit: (axis, value) ->
    return if @emits[axis]?.value is value
    @_stopEmit axis
    @trigger(value)
    @emits[axis] = {
      interval: setInterval(
        =>
          @trigger(value)
        200
      )
      value: value
    }

  _stopEmit: (axis) ->
    clearInterval @emits[axis]?.interval
    delete @emits[axis]

  _keyHandling: (e) ->
    return if @lastPressed and @lastPressed.getTime() > (new Date().getTime() - 200)
    @lastPressed = new Date()
    if e.button is @controlMap.fire && e.pressed
      @trigger('Fire', e)
    if e.button is @controlMap.up && e.pressed
      @trigger('Up', e)
    if e.button is @controlMap.down && e.pressed
      @trigger('Down', e)
    if e.button is @controlMap.left && e.pressed
      @trigger('Left', e)
    if e.button is @controlMap.right && e.pressed
      @trigger('Right', e)

  assignControls: (ship) ->
    ship.addComponent('GamepadMultiway')
      .gamepadMultiway
        speed: { y: 500, x: 500 }
        gamepadIndex: @controlMap.gamepadIndex
        analog: yes

    @listenTo ship, 'GamepadKeyChange', (e) =>
      if e.button is @controlMap.fire
        ship.shoot(e.pressed)
      if e.button is @controlMap.switchWeapon
        ship.switchWeapon(e.pressed)
      if e.button is @controlMap.super
        ship.superWeapon(e.pressed)

      # TODO: This event is not coming through
      # when the game is paused,
      # so unpausing is not possible!
      if e.button is @controlMap.pause
        Game.togglePause() if e.pressed

