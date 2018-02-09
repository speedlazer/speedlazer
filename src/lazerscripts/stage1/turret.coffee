{ EntityScript } = require('src/lib/LazerScript')

class TurretInActive extends EntityScript

  spawn: (options) ->
    Crafty.e('TurretInactive, BulletCannon, KeepAlive').bulletCannon()

  execute: ->
    @invincible yes

class TurretActive extends EntityScript

  spawn: (options) ->
    item = Crafty('TurretInactive')[0]
    if item
      entity = Crafty(item)
      entity.removeComponent('TurretInactive')
    else
      entity = Crafty.e('BulletCannon, KeepAlive').bulletCannon()

    entity

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @invincible no
      @action 'start-shooting'
      @repeat @sequence(
        @wait 100
        @action 'aim'
      )
    )

  onKilled: ->
    @leaveAnimation @sequence(
      @deathDecoy()
      @bigExplosion()
      @wait(400)
      @bigExplosion()
    )

module.exports = {
  TurretInActive,
  TurretActive
}
