
Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1Boss extends Game.EnemyScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 800
      x: 680
      y: 60
      speed: 1
    )

  execute: ->
    @sequence(
      @moveTo(x: 540, y: 200)
      @say('Enemy', 'Muhahah...')
      @wait 500
      @moveTo(y: 205, speed: 0.1)
      @repeat(2, @sequence(
        @repeat(2, @sequence(
          @moveTo(y: 200, speed: 0.1)
          @wait 500
          @moveTo(y: 205, speed: 0.1)
          @wait 500
        ))
        @runScriptAsync(Game.Scripts.Stage1BossMine, @location())
      ))
      @while(
        => @enemy.alive
        @sequence(
          @moveTo(y: 200, speed: 0.1)
          @wait 500
          @moveTo(y: 215, speed: 0.1)
          @wait 500
          @say('Enemy', 'blub 2...')
        )
      )
      # Unreachable statement test
      @say('Enemy', 'AAargh...')
    )

class Game.Scripts.Stage1BossMine extends Game.EnemyScript
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
