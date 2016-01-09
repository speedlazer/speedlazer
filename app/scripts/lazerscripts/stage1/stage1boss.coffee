Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1Boss extends Game.EntityScript
  assets: ->
    @loadAssets('largeDrone',
      sprites:
        'large-drone.png':
          tile: 90
          tileh: 70
          map:
            standardLargeDrone: [0,0]
            damage1LargeDrone: [1,0]
            damage2LargeDrone: [2,0]
            damage3LargeDrone: [3,0]
          paddingX: 1
        'large-drone-wing.png':
          tile: 46
          tileh: 21
          map:
            wingLoaded: [3,0]
          paddingX: 1
          paddingY: 1
        'large-drone-eye.png':
          tile: 20
          tileh: 26
          map:
            eyeStart: [0,0]
          paddingX: 1
          paddingY: 1
    )

class Game.Scripts.Stage1BossStage1 extends Game.Scripts.Stage1Boss

  spawn: ->
    Crafty.e('LargeDrone').drone(
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .35
      speed: 100
      pointsOnHit: 10
    )

  execute: ->
    @bindSequence 'Hit', @fase2, => @entity.health < 170000
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').color('#8080FF')
    @inventoryAdd 'item', 'diagonals', ->
      Crafty.e('PowerUp').powerUp(contains: 'diagonals', marking: 'D').color('#8080FF')

    @sequence(
      @animate 'slow', -1, 'eye'
      @disableWeapons()
      @parallel(
        @moveTo(x: .85, y: .41)
        @sequence(
          @say('Large Drone', 'We have control now! You will suffer!')
          @say('Large Drone', 'Earths defences are in our hands!')
          @wait 500
        )
      )
      @enableWeapons()
      @async @placeSquad(Game.Scripts.Stage1BossRocket,
        options:
          location: @location()
          pointsOnDestroy: 0
          pointsOnHit: 0
      )
      @animate 'emptyWing', 0, 'wing'
      @animate 'reload', 0, 'wing'
      @moveTo(y: .43, speed: 5)
      @attackCycle(5)
    )

  attackCycle: (speed) ->
    @repeat @sequence(
      @async @runScript(Game.Scripts.Stage1BossMine, @location())
      @moveTo(y: .41, speed: speed)
      @wait 200
      @async @placeSquad(Game.Scripts.Stage1BossRocket,
        options:
          location: @location()
          pointsOnDestroy: 0
          pointsOnHit: 0
      )
      @animate 'emptyWing', 0, 'wing'
      @animate 'reload', 0, 'wing'
      @async @runScript(Game.Scripts.Stage1BossMine, @location())
      @moveTo(y: .43, speed: speed)
      @async @placeSquad(Game.Scripts.Stage1BossRocket,
        options:
          location: @location()
          pointsOnDestroy: 0
          pointsOnHit: 0
      )
      @animate 'emptyWing', 0, 'wing'
      @wait 200
      @animate 'reload', 0, 'wing'
    )

  attackCycle2: (speed) ->
    @parallel(
      @repeat @sequence(
        @async @runScript(Game.Scripts.Stage1BossMine, @location())
        @wait 800
        @async @placeSquad(Game.Scripts.Stage1BossRocket,
          options:
            location: @location()
            pointsOnDestroy: 0
            pointsOnHit: 0
        )
        @animate 'emptyWing', 0, 'wing'
        @animate 'reload', 0, 'wing'
        @async @runScript(Game.Scripts.Stage1BossMine, @location())
        @wait 800
        @async @placeSquad(Game.Scripts.Stage1BossRocket,
          options:
            location: @location()
            pointsOnDestroy: 0
            pointsOnHit: 0
        )
        @animate 'emptyWing', 0, 'wing'
        @wait 800
        @animate 'reload', 0, 'wing'
      )
      @repeat @sequence(
        @pickTarget('PlayerControlledShip')
        @moveTo(@targetLocation(offsetY: -20), x: .85)
        @wait(1000)
      )
    )

  bombRaid: ->
    @sequence(
      @moveTo(y: .1)
      @while(
        @moveTo(x: -100, speed: 200)
        @sequence(
          @async @placeSquad(Game.Scripts.Stage1BossBombRaid,
            options:
              location: @location()
          )
          @wait 500
        )
      )
      => @entity.flipX()
      @while(
        @moveTo(x: 1.2, speed: 200)
        @sequence(
          @async @placeSquad(Game.Scripts.Stage1BossBombRaid,
            options:
              location: @location()
          )
          @wait 500
        )
      )
      => @entity.unflipX()
      @moveTo(x: .85, y: .41, speed: 200)
    )

  fase2: ->
    @bindSequence 'Hit', @fase3, => @entity.health < 160000

    @sequence(
      @setSpeed 50
      @bombRaid()
      @attackCycle(7)
    )

  fase3: ->
    @bindSequence 'Hit', @fase4, => @entity.health < 145000

    @sequence(
      @setSpeed 50
      @bombRaid()
      @attackCycle2(7)
    )

  fase4: ->
    @sequence(
      @drop(location: @location(), item: 'diagonals')
      @while(
        @moveTo(x: 1.15, y: .21, speed: 50)
        @sequence(
          @explosion(@location())
          @wait 700
        )
      )
    )

class Game.Scripts.Stage1BossMine extends Game.EntityScript
  assets: ->
    @loadAssets('mine',
      sprites:
        'mine.png':
          tile: 25
          tileh: 25
          map:
            standardMine: [0,0]
          paddingX: 1
    )

  spawn: (location) ->
    Crafty.e('Mine').mine(
      health: 200
      x: location().x
      y: location().y + 70
      speed: 200
      pointsOnHit: 0
      pointsOnDestroy: 0
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo(y: 1.1)
      @moveTo(@targetLocation(), y: 1.01)
      @moveTo(@targetLocation(x: null))
      @animate 'open'
      @wait 200
      @animate 'blink', -1
      @wait 1000
      @explosion(@location(), damage: yes, radius: 40)
    )

  onKilled: ->
    @explosion(@location(), damage: 200, radius: 40)


class Game.Scripts.Stage1BossRocket extends Game.EntityScript
  assets: ->
    @loadAssets('rocket',
      sprites:
        'rocket.png':
          tile: 46
          tileh: 16
          map:
            standardRocket: [0,0]
          paddingX: 1
    )

  spawn: (options) ->
    options = _.defaults(options,
      pointsOHit: 125
      pointsOnDestroy: 50
    )
    return null unless options.location?

    location = options.location?()
    return null unless location

    Crafty.e('Rocket').rocket(
      health: 250
      x: location.x - 30
      y: location.y - 8 + Math.round(Math.random() * 15)
      z: 0
      speed: 600
      pointsOnHit: options.pointsOnHit
      pointsOnDestroy: options.pointsOnDestroy
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled

    @moveTo(x: -205)

  onKilled: ->
    @explosion(@location(), damage: 200, radius: 40)


class Game.Scripts.Stage1BossPopup extends Game.Scripts.Stage1Boss
  spawn: ->
    Crafty.e('LargeDrone').drone(
      health: 134000
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .5
      speed: 150
    )

  execute: ->
    @bindSequence 'Hit', @leaveScreen, => @entity.health < 130000
    @inventoryAdd 'item', 'xp', ->
      Crafty.e('PowerUp').powerUp(contains: 'xp', marking: 'X')

    @sequence(
      @animate 'slow', -1, 'eye'
      @pickTarget('PlayerControlledShip')
      @moveTo(@targetLocation(), x: .845, 200)
      @attackCycle()
    )

  leaveScreen: ->
    @sequence(
      @drop(location: @location(), item: 'xp')
      @while(
        @moveTo(x: 1.15, speed: 100)
        @sequence(
          @explosion(@location())
          @wait 700
        )
      )
    )

  attackCycle: ->
    @repeat @sequence(
      @async @placeSquad(Game.Scripts.Stage1BossRocket,
        options:
          location: @location()
      )
      @animate 'emptyWing', 0, 'wing'
      @parallel(
        @moveTo(@targetLocation(offsetY: -20), x: .845)
        @sequence(
          @animate 'reload', 0, 'wing'
          @wait 1000
        )
      )
    )

class Game.Scripts.Stage1BossLeaving extends Game.Scripts.Stage1Boss
  spawn: ->
    Crafty.e('LargeDrone').drone(
      health: 134000
      x: Crafty.viewport.width + 40
      y: Crafty.viewport.height * .5
      speed: 150
    )

  execute: ->
    @inventoryAdd 'item', 'lasers', ->
      Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').color('#8080FF')

    @sequence(
      @animate 'slow', -1, 'eye'
      @pickTarget('PlayerControlledShip')
      @moveTo(@targetLocation(), x: .845, speed: 200)
      @attackCycle()
      @leaveScreen()
    )

  leaveScreen: ->
    @sequence(
      @animate 'emptyWing', 0, 'wing'
      => @entity.eye.destroy() # TODO: This is buggy when scaling enemy
      @sendToBackground(0.9, -100)
      @parallel(
        @moveTo(x: -.15, speed: 200)
        @scale(0.7, duration: 3000)
      )
      => @entity.flip('X')
      @sendToBackground(0.7, -550)
      @parallel(
        @moveTo('MiliBase', speed: 200)
        @scale(0.3, duration: 3000)
      )
    )

  attackCycle: ->
    @repeat 4, @sequence(
      @async @placeSquad(Game.Scripts.Stage1BossRocket,
        options:
          location: @location()
          pointsOnDestroy: 0
          pointsOnHit: 0
      )
      @animate 'emptyWing', 0, 'wing'
      @parallel(
        @moveTo(@targetLocation(offsetY: -20), x: .845)
        @sequence(
          @animate 'reload', 0, 'wing'
          @wait 1000
        )
      )
    )

class Game.Scripts.Stage1BossBombRaid extends Game.EntityScript
  assets: ->
    @loadAssets('mine',
      sprites:
        'mine.png':
          tile: 25
          tileh: 25
          map:
            standardMine: [0,0]
          paddingX: 1
    )

  spawn: (options) ->
    location = options.location()
    Crafty.e('Mine').mine(
      health: 200
      x: location.x
      y: location.y + 70
      speed: 400
      pointsOnHit: 10
      pointsOnDestroy: 20
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @sequence(
      @moveTo(y: 1.2)
    )

  onKilled: ->
    @explosion(@location(), damage: 300, radius: 40)


