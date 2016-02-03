
Crafty.c 'StageTitle',
  init: ->
    @requires '2D, DOM, Text, Tween, Delay, HUD'

  stageTitle: (text) ->
    this.attr w: Crafty.viewport.width, z: 1, alpha: 0
      .css 'textAlign', 'center'
      .text text
      .positionHud(
        x: @x,
        y: 240,
        z: -1
      )
      .textColor('#FF0000')
      .textFont({
        size: '30px'
        weight: 'bold'
        family: 'Press Start 2P'
      }).tween({ alpha: 1 }, 3000)
        .bind 'TweenEnd', =>
          @delay(
            ->
              @tween({ viewportY: @viewportY + 100, alpha: 0 }, 1500)
              @bind 'TweenEnd', =>
                @destroy()
            3000
            0
          )
