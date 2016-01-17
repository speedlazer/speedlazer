Game = @Game
Game.ScriptModule ?= {}

Game.ScriptModule.Colors =
  backgroundColorFade: (settings, bottomColors, topColors) ->
    (sequence) =>
      Crafty.background(bottomColors[0])
      Crafty.bind('BackgroundColor', @_colorHorizon)
      Crafty.trigger('BackgroundColor', bottomColors[0])
      d = WhenJS.defer()
      Crafty('Sky').get(0).colorFade(
        duration: settings.duration,
        skip: settings.skip ? 0
        bottomColors,
        topColors
      ).bind('ColorFadeFinished', ->
        Crafty.unbind('BackgroundColor', @_colorHorizon)
        d.resolve()
      )
      d.promise

  _colorHorizon: (c) ->
    return if Game.backgroundColor is c

    Game.backgroundColor = c
    Crafty('Horizon').each -> @colorDesaturation(c)
