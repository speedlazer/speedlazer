Game = @Game
Game.Scripts ||= {}

class Game.Scripts.Lunch extends Game.LazerScript
  metadata:
    namespace: 'City'
    speed: 0

  execute: ->
    @sequence(
      @setScenery('Blackness')
      @nextSlide()
      @placeSquad Game.Scripts.Slider,
        options:
          grid: new Game.LocationGrid
            x:
              start: 680
            y:
              start: 250

      @nextSlide()
      @setScenery('OpenSpace')
      @setSpeed 150
      @parallel(
        @placeSquad Game.Scripts.Slider,
          amount: 15
          options:
            grid: new Game.LocationGrid
              x:
                start: 680
                steps: 4
                stepSize: 40
              y:
                start: 100
                steps: 5
                stepSize: 50
        @sequence(
          @waitForScenery 'OpenSpace'
          @setSpeed 0
        )
      )
      @nextSlide()
      @setSpeed 50
      @nextSlide()
      @setScenery('Ocean')
      @nextSlide()
      @gainHeight 400, duration: 10000
      @nextSlide()
      @gainHeight -400, duration: 10000
    )


  nextSlide: ->
    @sequence(
      @while((=> @player(1).ship().superUsed is 0), @wait(1000))
      => @player(1).ship().superUsed = 0
    )


