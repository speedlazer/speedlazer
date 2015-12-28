Crafty.c 'GamepadControls',
  init: ->
    @requires 'Listener'
    @bind 'RemoveComponent', (componentName) ->
      @removeComponent 'GamepadControls' if componentName is 'ControlScheme'

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
    this

  _keyHandling: (e) ->
    if e.button is @controlMap.fire && e.pressed
      @trigger('Fire', e)

  assignControls: (ship) ->
    ship.addComponent('GamepadMultiway')
      .gamepad(@controlMap.gamepadIndex)
      .gamepadMultiway
        speed: { y: 250, x: 250 }
        gamepadIndex: @controlMap.gamepadIndex
        analog: yes

    @listenTo ship, 'GamepadKeyChange', (e) =>
      if e.button is @controlMap.fire
        ship.shoot(e.pressed)
      if e.button is @controlMap.secondary
        ship.secondary(e.pressed)
      if e.button is @controlMap.super
        ship.superWeapon(e.pressed)

      # TODO: This event is not coming through
      # when the game is paused,
      # so unpausing is not possible!
      if e.button is @controlMap.pause
        Game.togglePause() if e.pressed

