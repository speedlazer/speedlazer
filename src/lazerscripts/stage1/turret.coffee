{ EntityScript } = require('src/lib/LazerScript')

class TurretInActive extends EntityScript

  spawn: (options) ->
    Crafty.e('MineCannon, KeepAlive').mineCannon()


  execute: ->
    @invincible yes


module.exports = {
  TurretInActive
}
