Crafty.c 'Player',

  init: ->
    @resetCredits()

  resetCredits: ->
    @credits = 3
    @reset()

  reset: ->
    @stats =
      shotsFired: 0
      shotsHit: 0
      enemiesKilled: 0
      bonus: 0

    @removeComponent('ControlScheme')
      .attr({
        lives: 2,
        points: 0
      })

  loseLife: ->
    return unless @lives > 0
    @lives -= 1
    @trigger 'UpdateLives', lives: @lives

    if @lives <= 0
      Crafty.trigger('PlayerDied', this)

  addPoints: (amount) ->
    # Debatable should you get points for a target
    # that gets destroyed after you self died?
    return unless @lives > 0

    @points += amount
    @trigger 'UpdatePoints', points: @points
