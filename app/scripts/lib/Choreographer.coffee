class Game.Choreographer
  constructor: ->
    @_types =
      linear: @_getLinearChoreography
      swirl: @_getSwirlChoreography

  getPathForChoreography: (choreography) ->
    type = Object.keys(choreography)[0]
    @_types[type] choreography[type]

  _getLinearChoreography: (height) ->
    [[.5, height]
    [-20, height]]

  _getSwirlChoreography: (height) ->
    [[.5, height]
     [.156, .5]
     [.5, 1 - height]
     [.86, .5]
     [-20, height]]
