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

    Crafty.e('GamepadControls, PlayerAssignable')
      .controls
        gamepadIndex: 1
        fire: 0
        secondary: 2
        super: 4

    # Simply start splashscreen
    #Crafty.enterScene('Game', script: 'Lunch')
    Crafty.enterScene('Intro')

  resetCredits: ->
    @credits = 2 # This is actually 'Extra' credits, so in total 3

# Export
window.Game = Game

