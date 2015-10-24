
Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1Boss extends Game.EntityScript

  spawn: ->
    Crafty.e('Drone').drone(
      health: 2000
      x: 680
      y: 60
      speed: 1
    )

  execute: ->
    @bindSequence 'Destroyed', @onKilled
    @bindSequence 'Hit', @fase2, => @entity.health < 1000

    @sequence(
      @moveTo(x: 540, y: 200)
      @say('Enemy', 'Muhahah...')
      @wait 500
      @moveTo(y: 205, speed: 0.1)
      @while(
        => @enemy.alive
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
        => @enemy.alive
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
