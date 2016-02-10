
Crafty.c 'StageTitle',
  init: ->
    @requires '2D, DOM, Text, Tween, Delay, HUD'

  stageTitle: (number, text) ->
    ch = Crafty.e('2D, DOM, Text, Tween, HUD')
      .attr w: Crafty.viewport.width, z: 1, alpha: 0
      .css 'textAlign', 'center'
      .text "Chapter #{number}:"
      .positionHud(
        x: @x,
        y: 200,
        z: -1
      )
      .textColor('#EEEEEE')
      .textFont({
        size: '16px'
        weight: 'bold'
        family: 'Press Start 2P'
      }).tween({ alpha: 1 }, 3000)

    this.attr w: Crafty.viewport.width, z: 1, alpha: 0
      .css 'textAlign', 'center'
      .text text
      .positionHud(
        x: @x,
        y: 240,
        z: -1
      )
      .textColor('#EEEEEE')
      .textFont({
        size: '30px'
        weight: 'bold'
        family: 'Press Start 2P'
      }).tween({ alpha: 1 }, 3000)
        .bind 'TweenEnd', =>
          @delay(
            ->
              @tween({ viewportY: @viewportY + 100, alpha: 0 }, 1500)
              ch.tween({ viewportY: ch.viewportY + 100, alpha: 0 }, 1500)
              @bind 'TweenEnd', =>
                @destroy()
                ch.destroy()
            3000
            0
          )

