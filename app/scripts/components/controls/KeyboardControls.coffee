Crafty.c 'KeyboardControls',
  init: ->
    @requires 'Listener'
    @bind 'RemoveComponent', (componentName) ->
      @removeComponent('KeyboardControls') if componentName is 'ControlScheme'

  remove: ->
    @unbind('KeyDown', @_keyHandling)

  setupControls: (player) ->
    player.addComponent('KeyboardControls')
      .controls(@controlMap)
      .addComponent('ControlScheme')

  controls: (controlMap) ->
    @controlMap = controlMap
    @bind('KeyDown', @_keyHandling)
    this

  _keyHandling: (e) ->
    if e.key is @controlMap.fire
      @trigger('Fire', e)

  assignControls: (ship) ->
    controlMap = @controlMap

    movementMap = {}
    directions =
      up: -90
      down: 90
      left: 180
      right: 0

    # Remap back to key names to prevent sliding effect
    for direction, value of directions
      keyValue = controlMap[direction]
      for key, keyMap of Crafty.keys
        if keyMap is keyValue
          movementMap[key] = value

    ship.addComponent('Multiway, Keyboard')
      .multiway({ y: 4, x: 3 }, movementMap)

    @listenTo ship, 'KeyDown', (e) ->
      ship.shoot() if e.key is controlMap.fire
