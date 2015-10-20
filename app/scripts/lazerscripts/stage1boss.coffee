
Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1Boss extends Game.LazerScript

  execute: ->
    @sequence(
      @spawn ->
        Crafty.e('Drone').drone(
          health: 800
          x: 680
          y: 60
          speed: 1
        )
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
        @if(
          => @enemy().alive
          @runScriptAsync(Game.Scripts.Stage1BossMine, @location())
        )
      ))
      @while(
        => @enemy().alive
        @sequence(
          @moveTo(y: 200, speed: 0.1)
          @wait 500
          @moveTo(y: 205, speed: 0.1)
          @wait 500
        )
      )
      @say('Enemy', 'AAargh...')
    )

class Game.Scripts.Stage1BossMine extends Game.LazerScript
  execute: (location) ->
    @sequence(
      @spawn ->
        Crafty.e('Drone').drone(
          health: 200
          x: location().x
          y: location().y + 30
          speed: 2
        )
      @moveTo(y: 425)
      @moveTo(x: 200)
      @moveTo(y: 200)
    )
