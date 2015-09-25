
Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Stage1 extends Game.LazerScript
    execute: ->
      @inventoryAdd 'enemy', 'drone', -> Crafty.e('Drone').drone()
      @inventoryAdd 'item', 'lasers', -> Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L')

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
        @wave('FlyOver', enemy: 'drone')
        @say('General', 'We dropped an upgrade to show the weapon systems')
        @dropWeaponsForEachPlayer()
        @wait(2000)
        @wave('FlyOver', enemy: 'drone')
      )

    dropWeaponsForEachPlayer: ->
      @sequence(
        @if((-> @player(1).active and !@player(1).has('lasers')), @drop(item: 'lasers', inFrontOf: @player(1)))
        @if((-> @player(2).active and !@player(2).has('lasers')), @drop(item: 'lasers', inFrontOf: @player(2)))
      )


