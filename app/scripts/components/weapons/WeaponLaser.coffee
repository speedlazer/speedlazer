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

  addXP: ->
    @xp += 1
    @level = @determineLevel @xp

  determineLevel: (xp) ->
    levelBoundaries = [3, 8, 20, 50]
    neededXP = 0
    level = 0
    for i in levelBoundaries
      neededXP += i
      level += 1 if xp >= neededXP

    progress = (xp - (levelBoundaries[level - 1] ? 0)) / levelBoundaries[level]
    console.log 'level: ', level, progress * 100, '%'
    return level

  shoot: ->
    settings = switch @level
      when 0 then w: 4, speed: 2, h: 3
      when 1 then w: 6, speed: 3, h: 4
      when 2 then w: 8, speed: 4, h: 5
      when 3 then w: 10, speed: 5, h: 5
      when 4 then w: 12, speed: 7, h: 6

    Crafty.e('Bullet')
      .color(@ship.color())
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
        @ship.trigger('BulletHit')
      .bind 'DestroyTarget', =>
        @ship.trigger('BulletDestroyedTarget')

