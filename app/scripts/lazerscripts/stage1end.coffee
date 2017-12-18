require('src/scripts/lazerscripts/lunch/presentation_leave_screen')
{ LazerScript } = require('src/scripts/lib/LazerScript')

class Game.Scripts.Stage1End extends LazerScript

  assets: ->
    @loadAssets('explosion')

  execute: ->
    @sequence(
      @parallel(
        @sequence(
          @disableControls()
          @disableWeapons()
          @placeSquad(Game.Scripts.PresentationLeaveScreen,
            amount: 2
            delay: 1000
          )
        )
        @sequence(
          @say 'This is it for now!\nMore content coming soon!'
          @say 'Thanks for playing!\nThe heroes will return...'
        )
      )
      @screenFadeOut()
      @endGame()
    )


