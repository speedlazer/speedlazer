
Crafty.c 'BigText',
  init: ->
    @requires '2D, Text, Tween, Delay, UILayerDOM'

  bigText: (text, options = {}) ->
    options = _.defaults(options,
      color: '#EEEEEE'
      mode: 'fadeIn'
      super: null
      blink_amount: 3
      blink_speed: 1000
    )
    modes =
      'fadeIn':
        enter: (els) ->
          d = WhenJS.defer()
          els[0].one 'TweenEnd', -> d.resolve()
          el.tween({ alpha: 1 }, 3000) for el in els
          d.promise
        wait: (els) ->
          d = WhenJS.defer()
          els[0].delay((-> d.resolve()), 3000, 0)
          d.promise
        leave: (els) ->
          d = WhenJS.defer()
          els[0].one 'TweenEnd', -> d.resolve()
          el.tween({ viewportY: el.viewportY + 100, alpha: 0 }, 1500) for el in els
          d.promise
      'blink':
        enter: (els) ->
          el.attr(alpha: 1) for el in els
          return WhenJS()
        wait: (els) ->
          d = WhenJS.defer()
          els[0].delay((->
            e.attr(alpha: (e.alpha + 1) % 2) for e in els
          ), options.blink_speed, ((options.blink_amount - 1) * 2) + 1, (-> d.resolve()))
          d.promise
        leave: (els) ->
          el.attr(alpha: 0) for el in els
          return WhenJS()

    texts = [this]
    if options.super?
      ch = Crafty.e('2D, Text, Tween, UILayerDOM')
        .attr w: Crafty.viewport.width, z: 1, alpha: 0
        .textAlign 'center'
        .text options.super
        .attr(
          x: @x,
          y: 200,
          z: -1
        )
        .textColor(options.color)
        .textFont({
          size: '16px'
          weight: 'bold'
          family: 'Press Start 2P'
        })
      texts.push ch

    this.attr w: Crafty.viewport.width, z: 1, alpha: 0
      .textAlign 'center'
      .text text
      .attr(
        x: @x,
        y: 240,
        z: -1
      )
      .textColor(options.color)
      .textFont({
        size: '30px'
        weight: 'bold'
        family: 'Press Start 2P'
      })

    mode = modes[options.mode]
    mode.enter(texts).then ->
      mode.wait(texts).then ->
        mode.leave(texts).then ->
          t.destroy() for t in texts

