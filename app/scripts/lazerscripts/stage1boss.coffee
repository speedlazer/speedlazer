
Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Swirler extends Game.EntityScript

  spawn: (options) ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 240
      speed: options.speed ? 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath [
      [320, 100]
      [100, 240]
      [320, 400]
      [550, 250]
      [-10, 100]
    ]

  onKilled: ->
    @explosion(@location())

class Game.Scripts.Swirler2 extends Game.EntityScript

  spawn: (options) ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 340
      speed: options.speed ? 200
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @movePath [
      [320, 300]
      [130, 240]
      [340, 100]
      [550, 250]
      [-10, 400]
    ]

  onKilled: ->
    @explosion(@location())

class Game.Scripts.Splasher extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 400
      speed: 100
    )

  execute: ->
    @sequence(
      @sendToBackground(0.75, -200)
      @movePath [
        [620, 270]
        [520, 320]
        [420, 230]
        [320, 330]
        [319, 360]
      ]
      @moveTo y: 600
    )

class Game.Scripts.Stalker extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 400
      speed: 300
    )

  execute: ->
    @sequence(
      @pickTarget('PlayerControlledShip')
      @moveTo(x: 680, y: 450)
      @repeat(10, @sequence(
        @moveTo(@targetLocation(), y: 450, speed: 200)
        @wait 100
      ))
      @moveTo(y: -50)
    )

class Game.Scripts.Stage1Boss extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 2000
      x: 680
      y: 400
      speed: 100
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @bindSequence 'Hit', @fase2, => @entity.health < 1000
    #@sequence(
      #@pickTarget('PlayerControlledShip')
      #@moveTo(x: 680, y: 450)
      #@repeat(20, @sequence(
        #@moveTo(@targetLocation(), y: 450, speed: 4)
        #@wait 150
      #))
      #@moveTo(y: -50)
      ##@wait 10000
    #)

    @sequence(
      @moveTo(x: 540, y: 200)
      @say('Enemy', 'Muhahah...')
      @wait 500
      @moveTo(y: 205, speed: 5)
      @repeat @sequence(
        @runScriptAsync(Game.Scripts.Stage1BossMine, @location())
        @moveTo(y: 200, speed: 5)
        @wait 500
        @moveTo(y: 205, speed: 5)
        @wait 500
      )
    )

  onKilled: ->
    @say('Enemy', 'AAargh... This is the text!')

  fase2: ->
    @sequence(
      @moveTo(x: 340, y: 100, speed: 100)
      @say('Enemy', 'You make me mad!')
      @moveTo(y: 205, speed: 100)
      @repeat @sequence(
        @runScriptAsync(Game.Scripts.Stage1BossMine, @location())
        @moveTo(y: 200, speed: 5)
        @wait 500
        @moveTo(y: 205, speed: 5)
        @wait 500
      )
    )

class Game.Scripts.Stage1BossMine extends Game.EntityScript
  spawn: (location) ->
    Crafty.e('Drone').drone(
      health: 200
      x: location().x
      y: location().y + 30
      speed: 200
    )

  execute: ->
    @sequence(
      @moveTo(y: 525)
      @moveTo(x: 200)
      @moveTo(y: 200)
      @wait 2000
      @explosion(@location())
    )
