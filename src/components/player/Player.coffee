EXTRA_LIFE_POINT_BOUNDARY = 15000

Crafty.c 'Player',
  init: ->
    @reset()

  reset: ->
    @softReset()
    @removeComponent('ControlScheme') if @has('ControlScheme')

  softReset: ->
    @stats =
      shotsFired: 0
      shotsHit: 0
      enemiesKilled: 0
      bonus: 0

    @attr({
      lives: 3,
      health: 5
      maxHealth: 5
      points: 0
    })

  loseHealth: (damage) ->
    @health -= damage
    @trigger 'UpdateHealth', health: @health

  loseLife: ->
    return unless @lives > 0
    @lives -= 1
    @health = @maxHealth
    @trigger 'UpdateLives', lives: @lives

    if @lives <= 0
      Crafty.trigger('PlayerDied', this)

  gainLife: ->
    @lives += 1
    @trigger 'UpdateLives', lives: @lives

  healthUpgrade: ->
    @maxHealth += 1
    @health = @maxHealth
    @trigger 'UpdateHealth', maxHealth: @maxHealth, health: @health

  healthBoost: ->
    @health = @maxHealth
    @trigger 'UpdateHealth', health: @health

  eligibleForExtraLife: ->
    @lastExtraLifeThreshold ||= 0
    if @points - @lastExtraLifeThreshold >= EXTRA_LIFE_POINT_BOUNDARY
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
        distance: 30
        delay: 10
      )

    @points += amount
    @trigger 'UpdatePoints', points: @points
