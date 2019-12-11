{ EntityScript } = require('src/lib/LazerScript')

class TurretInActive extends EntityScript

  spawn: (options) ->
    e = Crafty.e('TurretInactive, BulletCannon, KeepAlive').bulletCannon()
    if options.onHatch
      e.hideBelow(459)
    return e

  execute: ->
    @invincible yes

class TurretActive extends EntityScript

  spawn: (options) ->
    if !options.decoy
      entity = Crafty('TurretInactive').get(0)

    if entity
      entity.removeComponent('TurretInactive')
    else
      entity = Crafty.e('BulletCannon, KeepAlive').bulletCannon({
        health: options.health
      })

    if options.label
      entity.addComponent(options.label)
    if !options.deathDecoy
      entity.chainable = options.chainable
    if options.onHatch
      entity.addComponent("OnHatch")
    entity

  execute: ->
    #@bindSequence 'Deactivate', @deactivate
    @bindSequence 'Destroyed', @onKilled
    @activate()

  activate: ->
    @bindSequence 'Deactivate', @deactivate
    @sequence(
      @invincible no
      @action 'start-shooting'
      @repeat @sequence(
        @wait 80
        @action 'aim'

      )
    )

  deactivate: ->
    @bindSequence 'Activate', @activate
    @sequence(
      @action 'stop-shooting'
      @action 'reset-aim'
      @repeat(
        @wait 500
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
