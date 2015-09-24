
Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1 extends Game.LazerScript
    execute: ->
      @sequence(
        @introText()
        @tutorial()
      )

    introText: ->
      @say('General', 'Just give her a good last flight,\nwe document some moves on the way!')

    tutorial: ->
      @say('General', 'Evade the upcoming drones!')

