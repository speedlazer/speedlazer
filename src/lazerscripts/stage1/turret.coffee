{ EntityScript } = require('src/lib/LazerScript')

class TurretInActive extends EntityScript

  spawn: (options) ->
    Crafty.e('TurretInactive, BulletCannon, KeepAlive').bulletCannon()

  execute: ->
    @invincible yes

class TurretActive extends EntityScript

  spawn: (options) ->
    if !options.decoy
      entity = Crafty('TurretInactive').get(0)

    if entity
      entity.removeComponent('TurretInactive')
    else
      entity = Crafty.e('BulletCannon, KeepAlive').bulletCannon()

    if !options.deathDecoy
      entity.chainable = options.chainable

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
      @sendToBackground(1.0)
      @bigExplosion()
      @wait(400)
      @bigExplosion()
    )

module.exports = {
  TurretInActive,
  TurretActive
}
