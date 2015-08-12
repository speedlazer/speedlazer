
Crafty.c 'StageTitle',
  init: ->
    @requires '2D, DOM, Text, Tween, Delay, HUD'

  stageTitle: (text) ->
    this.attr w: 640, z: 1
      .css 'textAlign', 'center'
      .text text
      .positionHud(
        x: @x,
        y: 240,
        z: -1
      )
      .textColor('#FF0000')
      .textFont({
        size: '30px',
        weight: 'bold',
        family: 'Courier new'
      }).delay( ->
        @tween({ viewportY: @viewportY + 500, alpha: 0 }, 3000)
        @bind 'TweenEnd', =>
          @destroy()
      , 3000, 0)
