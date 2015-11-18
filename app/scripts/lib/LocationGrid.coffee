Game = @Game

class Game.LocationGrid
  constructor: (settings) ->
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


