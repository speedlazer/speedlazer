
Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1 extends Game.LazerScript
    execute: ->
      @sequence(
        @introText()
        @tutorial()
      )

    introText: ->
      @sequence(
        @wait 1000 # Time for more players to activate
        @if((-> @player(1).active and @player(2).active)
          @say 'John', 'Too bad we have to bring these ships to the museum!'
        # else
          @say 'John', 'Too bad we have to bring this ship to the museum!'
        )

        @say 'General', 'Just give her a good last flight,\nwe document some moves on the way!'
      )

    tutorial: ->
      @sequence(
        @say('General', 'Evade the upcoming drones!')
        #@wave('FlyOver', enemy: 'drone')
      )

