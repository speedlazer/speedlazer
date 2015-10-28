
Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Swirler extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 200
      x: 680
      y: 240
      speed: 3
    )

  execute: ->
    @sequence(
      @movePath [
        [320, 100]
        [100, 240]
        [320, 400]
        [550, 250]
        [-10, 100]
      ]
    )


class Game.Scripts.Stage1Boss extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 2000
      x: 680
      y: 400
      speed: 9
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
      @moveTo(y: 205, speed: 0.1)
      @while(
        @sequence(
          @runScriptAsync(Game.Scripts.Stage1BossMine, @location())
          @moveTo(y: 200, speed: 0.1)
          @wait 500
          @moveTo(y: 205, speed: 0.1)
          @wait 500
        )
      )
    )

  onKilled: ->
    @say('Enemy', 'AAargh... This is the text!')

  fase2: ->
    @sequence(
      @moveTo(x: 340, y: 100, speed: 4)
      @say('Enemy', 'You make me mad!')
      @moveTo(y: 205, speed: 4)
      @while(
        @sequence(
          @runScriptAsync(Game.Scripts.Stage1BossMine, @location())
          @moveTo(y: 200, speed: 0.1)
          @wait 500
          @moveTo(y: 205, speed: 0.1)
          @wait 500
        )
      )
    )


class Game.Scripts.Stage1BossMine extends Game.EntityScript
  spawn: (location) ->
    Crafty.e('Drone').drone(
      health: 200
      x: location().x
      y: location().y + 30
      speed: 4
    )

  execute: ->
    @sequence(
      @moveTo(y: 525)
      @moveTo(x: 200)
      @moveTo(y: 200)
    )
