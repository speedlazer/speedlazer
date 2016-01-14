Game = @Game
Game.ScriptModule ?= {}

Game.ScriptModule.Colors =
  colorFade: (settings, colors...) ->
    (sequence) =>
      d = WhenJS.defer()
      @entity
        .colorFade(settings, colors...)
        .bind('ColorFadeFinished', -> d.resolve())
      d.promise

  backgroundColorFade: (settings, colors...) ->
    (sequence) =>
      Crafty.background(colors[0])
      Crafty.bind('BackgroundColor', @_colorHorizon)
      Crafty.trigger('BackgroundColor', colors[0])
      d = WhenJS.defer()
      Crafty.e('ColorFade, 2D').colorFade(
        duration: settings.duration,
        skip: settings.skip ? 0
        background: yes, colors...)
        .bind('ColorFadeFinished', ->
          Crafty.unbind('BackgroundColor', @_colorHorizon)
          d.resolve()
          @destroy()
        )
      d.promise

  _colorHorizon: (c) ->
    Crafty('Horizon').each -> @colorDesaturation(c, @d)
