{ EntityScript } = require('src/lib/LazerScript')

class MineCannon extends EntityScript

  spawn: (options) ->
    Crafty.e('MineCannon, KeepAlive').mineCannon()

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @invincible yes
      @wait 1000
      @invincible no
      @repeat @sequence(
        @async @placeSquad CannonMine,
          amount: 5
          delay: 1500
          options:
            location: @get('barrelEnd')
        @wait 3000
        @action 'aim'
        @wait 3000
        @action 'aim'
        @wait 3000
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

class CannonMine extends EntityScript

  spawn: (options) ->
    location = options.location()

    coords = (angle, origin, distance) ->
      r = ((Math.PI / 180) * angle)
      x = origin.x - Math.cos(r) * distance
      y = origin.y - Math.sin(r) * distance
      { x, y }

    endXY = coords(
      location.angle,
      {
        x: location.xStart
        y: location.yStart
      },
      300
    )

    @locationInfo = {
      startX: location.xStart
      startY: location.yStart
      endX: endXY.x
      endY: endXY.y
    }

    Crafty.e('Mine').mine(
      x: @locationInfo.startX
      y: @locationInfo.startY
      z: 10
      defaultSpeed: 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @parallel(
        @movePath [
          [@locationInfo.startX, @locationInfo.startY]
          [@locationInfo.endX, @locationInfo.endY]
          [@locationInfo.endX - 400, 0.9]
        ], rotate: no, speed: 600
        @sequence(
          @wait(250)
          @blast(@location())
        )
      )
      @pickTarget('PlayerControlledShip')
      @moveTo(y: 1.1, easing: 'easeInQuad')
      => @entity.attr(z: 0)
      @moveTo(@targetLocation(), y: 1.01, easing: 'easeInOutQuad')
      @moveTo(@targetLocation(x: null))
      @animate 'open'
      @wait 200
      @animate 'blink', -1
      @wait 1000
      => @entity.absorbDamage damage: @entity.health
      @endSequence()
    )

  onKilled: ->
    @bigExplosion()

module.exports =
  default: MineCannon
