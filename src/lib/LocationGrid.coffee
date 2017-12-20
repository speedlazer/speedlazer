defaults = require('lodash/defaults')
shuffle = require('lodash/shuffle')

class Game.LocationGrid
  constructor: (settings) ->
    settings = defaults settings,
      x: {}
      y: {}

    settings.x = defaults settings.x,
      start: 0
      steps: 1
      stepSize: 1

    settings.y = defaults settings.y,
      start: 0
      steps: 1
      stepSize: 1

    xs = @_coordList(settings.x)
    ys = @_coordList(settings.y)
    coords = []
    for y in ys
      for x in xs
        xPerc = (x - settings.x.start) / (settings.x.stepSize * settings.x.steps)
        yPerc = (y - settings.y.start) / (settings.y.stepSize * settings.y.steps)
        coords.push { x, y, xPerc, yPerc }

    @freeCoords = shuffle coords

  _coordList: (listSettings) ->
    for i in [0...listSettings.steps]
      listSettings.start + (i * listSettings.stepSize)

  getLocation: ->
    @freeCoords.pop()


