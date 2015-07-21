Crafty.c 'PlayerControlledShip',
  init: ->
    @requires '2D, Canvas, Color, Collision, Delay'
    @attr w: 30, h: 30
    @bind 'Moved', (from) ->
      if @hit('Edge') # Contain player within playfield
        @attr x: from.x, y: from.y
    @_forcedSpeed =
      x: 0
      y: 0

    @delay ->
      @addComponent('Invincible').invincibleDuration(2000)
      @onHit 'Enemy', ->
        return if @has('Invincible')
        @trigger('Hit')

      @onHit 'LaserBeam', ->
        return if @has('Invincible')
        @trigger('Hit')
    , 10, 0

    @bind 'EnterFrame', ->
      @x += @_forcedSpeed.x
      @y += @_forcedSpeed.y
      # Move player back if flying into an object
      @x -= @_forcedSpeed.x if @hit('Edge')
      @y -= @_forcedSpeed.y if @hit('Edge')

      # still hitting an object? then we where forced in
      # and are crashed (squashed probably)
      @trigger('Hit') if @hit('Edge')

  forcedSpeed: (speed) ->
    if speed.x? && speed.y?
      @_forcedSpeed.x = speed.x
      @_forcedSpeed.y = speed.y
    else
      @_forcedSpeed.x = speed
      @_forcedSpeed.y = 0
    this

  shoot: ->
    Crafty.e('Bullet')
      .color(@color())
      .attr
        x: @x + @w
        y: @y + (@h / 2.0)
        w: 5
        h: 5
      .fire
        origin: this
        damage: 100
        speed: @_forcedSpeed.x + 3
        direction: 0
      .bind 'HitTarget', =>
        @trigger('BulletHit')
      .bind 'DestroyTarget', =>
        @trigger('BulletDestroyedTarget')
