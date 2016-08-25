Crafty.c 'Player',
  init: ->
    @reset()

  reset: ->
    @softReset()
    @removeComponent('ControlScheme')

  softReset: ->
    @stats =
      shotsFired: 0
      shotsHit: 0
      enemiesKilled: 0
      bonus: 0

    @attr({
      lives: 3 #Infinity,
      points: 0
    })

  loseLife: ->
    return unless @lives > 0
    @lives -= 1
    @trigger 'UpdateLives', lives: @lives

    if @lives <= 0
      Crafty.trigger('PlayerDied', this)

  gainLife: ->
    @lives += 1
    @trigger 'UpdateLives', lives: @lives

  eligibleForExtraLife: ->
    @lastExtraLifeThreshold ||= 0
    if @points - @lastExtraLifeThreshold >= 10000
      yes

  rewardExtraLife: ->
    @lastExtraLifeThreshold = @points

  addPoints: (amount, location) ->
    # Debatable should you get points for a target
    # that gets destroyed after you self died?
    return unless @lives > 0
    if location and amount > 0
      @ship.scoreText("+#{amount}",
        location: location
        attach: no
        duration: 200
        distance: 10
      )

    @points += amount
    @trigger 'UpdatePoints', points: @points
