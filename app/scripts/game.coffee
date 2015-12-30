Game =
  # Initialize and start our game
  start: ->
    @firstLevel = 'Game'
    @resetCredits()

    Crafty.paths(
      audio: 'audio/'
      images: 'images/'
    )
    # Start crafty and set a background color so that we can see it's working
    Crafty.init(1024, 576, $('#cr-stage')[0]) # PAL+
    #Crafty.pixelart(true)
    Crafty.background('#000000')

    Crafty.e('Player, Color')
      .attr(name: 'Player 1', z: 0)
      .setName('Player 1')
      .color('#FF0000')

    Crafty.e('Player, Color')
      .attr(name: 'Player 2', z: 10)
      .setName('Player 2')
      .color('#00FF00')

    Crafty.e('KeyboardControls, PlayerAssignable')
      .controls
        fire: Crafty.keys.SPACE
        secondary: Crafty.keys.PERIOD
        super: Crafty.keys.ENTER
        up: Crafty.keys.UP_ARROW
        down: Crafty.keys.DOWN_ARROW
        left: Crafty.keys.LEFT_ARROW
        right: Crafty.keys.RIGHT_ARROW
        pause: Crafty.keys.P


    Crafty.e('KeyboardControls, PlayerAssignable')
      .controls
        fire: Crafty.keys.G
        secondary: Crafty.keys.H
        up: Crafty.keys.W
        down: Crafty.keys.S
        left: Crafty.keys.A
        right: Crafty.keys.D
        pause: Crafty.keys.Q


    Crafty.e('GamepadControls, PlayerAssignable')
      .controls
        gamepadIndex: 0
        fire: 0
        secondary: 2
        super: 4
        pause: 9
        up: 12
        down: 13
        left: 14
        right: 15

    Crafty.e('GamepadControls, PlayerAssignable')
      .controls
        gamepadIndex: 1
        fire: 0
        secondary: 2
        super: 4
        up: 12
        down: 13
        left: 14
        right: 15

    # Simply start splashscreen
    #Crafty.enterScene('Game', script: 'Lunch')
    Crafty.enterScene('Intro')

  resetCredits: ->
    @credits = 2 # This is actually 'Extra' credits, so in total 3

  highscores: ->
    @loadedList = JSON.parse(localStorage.getItem('SPDLZR') ? '[]')

    defInit = 'SPD'
    list = [
      { initials: defInit, score: 6000 }
      { initials: defInit, score: 5000 }
      { initials: defInit, score: 4000 }
      { initials: defInit, score: 3000 }
      { initials: defInit, score: 2000 }
      { initials: defInit, score: 1500 }
      { initials: defInit, score: 1000 }
      { initials: defInit, score: 500 }
      { initials: defInit, score: 200 }
      { initials: defInit, score: 100 }
    ].concat @loadedList
    _.sortBy(list, 'score').reverse()

  addScoreEntry: (points, name) ->
    @loadedList ?= []
    @loadedList.push({ initials: name, score: points })
    localStorage.setItem('SPDLZR', JSON.stringify(@loadedList))

# Export
window.Game = Game

