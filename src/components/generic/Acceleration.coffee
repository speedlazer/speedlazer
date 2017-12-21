defaults = require('lodash/defaults')

Crafty.c 'Acceleration',
  init: ->
    @_currentSpeed = { x: 0, y: 0 }
    @_targetSpeed = { x: 0, y: 0 }
    @_accelerate = { x: .01, y: .01 }
    @_currentAcceleration = { x: 0, y: 0 }

  updateAcceleration: ->
    @_handleAcceleration('x')
    @_handleAcceleration('y')

  targetSpeed: (speed, options = {}) ->
    options = defaults(options,
      accellerate: yes
    )
    if options.accellerate
      @_accelerate = { x: .01, y: .01 }
    else
      @_accelerate = { x: Infinity, y: Infinity }

    if speed.x? && speed.y?
      @_targetSpeed.x = speed.x
      @_targetSpeed.y = speed.y
    else
      @_targetSpeed.x = speed
      @_targetSpeed.y = 0
    this

  _handleAcceleration: (axis) ->
    return if @_currentSpeed[axis] == @_targetSpeed[axis]
    a = 1
    a = -1 if @_currentSpeed[axis] > @_targetSpeed[axis]

    @_currentAcceleration[axis] += @_accelerate[axis] * a
    @_currentSpeed[axis] += @_currentAcceleration[axis]

    return if @_currentAcceleration[axis] > 0 and @_currentSpeed[axis] < @_targetSpeed[axis]
    return if @_currentAcceleration[axis] < 0 and @_currentSpeed[axis] > @_targetSpeed[axis]

    @_currentSpeed[axis] = @_targetSpeed[axis]
    @_currentAcceleration[axis] = 0

