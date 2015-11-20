Game = @Game

class Game.LocationGrid
  constructor: (settings) ->
    settings = _.defaults settings,
      x: {}
      y: {}

    settings.x = _.defaults settings.x,
      start: 0
      steps: 1
      stepSize: 1

    settings.y = _.defaults settings.y,
      start: 0
      steps: 1
      stepSize: 1

    xs = @_coordList(settings.x)
    ys = @_coordList(settings.y)
    coords = []
    for y in ys
      for x in xs
        coords.push { x, y }

    @freeCoords = _.shuffle coords

  _coordList: (listSettings) ->
    for i in [0...listSettings.steps]
      listSettings.start + (i * listSettings.stepSize)

  getLocation: ->
    @freeCoords.pop()


