class Game.Choreographer
  constructor: ->
    @_choreographies =
      linear: @_getLinearChoreography
      swirl: @_getSwirlChoreography

  getPathForChoreography: (choreography) ->
    @_choreographies[choreography]()

  _getLinearChoreography: ->
    [[.5, .5]
    [-20, .5]]

  _getSwirlChoreography: ->
    [[.5, .21]
     [.156, .5]
     [.5, .833]
     [.86, .52]
     [-20, .21]]
