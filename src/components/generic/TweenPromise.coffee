Crafty.c 'TweenPromise',
  init: ->
    @requires 'Tween'

  tweenPromise: (args...) ->
    d = WhenJS.defer()
    @one('TweenEnd', -> d.resolve())
    @tween args...
    d.promise

