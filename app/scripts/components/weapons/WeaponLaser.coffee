Crafty.c 'WeaponLaser',
  init: ->
    @requires '2D,Canvas,Color'
    @color '#808080'
    @attr
      w: 30
      h: 5

  remove: ->

  install: (@ship) ->
    @xp = 0
    @level = @determineLevel @xp
    @attr
      x: @ship.x + 10
      y: @ship.y + 15
    @ship.attach this

  addXP: (amount) ->
    @xp += amount
    level = @level
    @level = @determineLevel @xp
    if level isnt @level
      @trigger 'levelUp', @level

  determineLevel: (xp) ->
    levelBoundaries = [150, 400, 1000, 2500]
    levelBoundaries = [15, 40, 100, 250]
    neededXP = 0
    level = 0
    for i in levelBoundaries
      neededXP += i
      level += 1 if xp >= neededXP

    progress = (xp - (levelBoundaries[level - 1] ? 0)) / levelBoundaries[level]
    return level

  shoot: (onOff) ->
    return unless onOff
    settings = switch @level
      when 0 then w: 4, speed: 7, h: 3
      when 1 then w: 6, speed: 7, h: 4
      when 2 then w: 8, speed: 7, h: 5
      when 3 then w: 10, speed: 7, h: 5
      when 4 then w: 12, speed: 7, h: 6

    Crafty.e('Bullet')
      .color('#FFFF00')
      #.color(@ship.color())
      .attr
        x: @x + @w
        y: @y + (@h / 2) - (settings.h / 2)
        w: settings.w
        h: settings.h
      .fire
        origin: this
        damage: 100
        speed: @ship._forcedSpeed.x + settings.speed
        direction: 0
      .bind 'HitTarget', =>
        @addXP(1)
        @ship.trigger('BulletHit')
      .bind 'DestroyTarget', =>
        @addXP(5)
        @ship.trigger('BulletDestroyedTarget')

