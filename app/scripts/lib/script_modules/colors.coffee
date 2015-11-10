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
       d = WhenJS.defer()
       Crafty.e('ColorFade, 2D').colorFade(
         duration: settings.duration,
         skip: settings.skip ? 0
         background: yes, colors...)
         .bind('ColorFadeFinished', ->
           d.resolve()
           @destroy()
          )
       d.promise
