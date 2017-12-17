class Game.Scripts.MineCannon extends Game.EntityScript

  spawn: (options) ->
    Crafty.e('MineCannon, KeepAlive').mineCannon()

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @invincible yes
      @wait 1000
      @invincible no
      @repeat @sequence(
        @async @placeSquad Game.Scripts.CannonMine,
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
      @bigExplosion()
      @wait(400)
      @bigExplosion()
      @wait(10000)
      @endDecoy()
    )

class Game.Scripts.CannonMine extends Game.EntityScript

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
        x: location.xStart + Crafty.viewport.x
        y: location.yStart + Crafty.viewport.y
      },
      300
    )

    @locationInfo = {
      startX: location.xStart + Crafty.viewport.x
      startY: location.yStart + Crafty.viewport.y
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
          @wait(100)
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
