Crafty.c 'StageEnd',
  init: ->
    @requires '2D, DOM, Text, HUD, Delay'

  stageEnd: (level) ->
    @lineNr = 0
    this.attr w: 640, z: 1
      .css 'textAlign', 'center'
      .text "Stage #{level.data.stage} Cleared: #{level.data.title}"
      .positionHud(
        x: @x,
        y: 60,
        z: -1
      )
      .textColor('#FFFFFF')
      .textFont({
        size: '12px',
        weight: 'bold',
        family: 'Courier new'
      }).delay((i) ->
        switch @lineNr
          when 0
            @showPlayerHeaders()
            @showAccuracy level
          when 2 then @showShotsFired level
          when 3 then @showEnemiesKilled level
          when 4 then @showLives level
          when 5 then @showWeaponXP level
          when 6 then @showTotals level
          when 7 then level.data.stageFinished = yes
      , 1000, 6)

  showPlayerHeaders: ->
    cells = ['']
    Crafty('Player').each ->
      if @has('ControlScheme')
        cells.push @name
      else
        cells.push ''
      cells.push ''
    @addCelledLine cells

  showAccuracy: (level) ->
    cells = ['Accuracy']
    Crafty('Player').each ->
      if @has('ControlScheme')
        if @stats.shotsHit > 0 and @stats.shotsFired > 0
          value = Math.round((@stats.shotsHit / @stats.shotsFired) * 1000) / 10.0
        else
          value = 0.0
        cells.push "#{value}%"
        score = Math.round(value * 100)
        cells.push "#{score}"
        @stats.bonus += score
      else
        cells.push ''
        cells.push ''
    @addCelledLine cells

  showShotsFired: (level) ->
    cells = ['Shots fired']
    Crafty('Player').each ->
      if @has('ControlScheme')
        value = @stats.shotsFired
        cells.push "#{value}"

        if @stats.shotsHit > 0 and @stats.shotsFired > 0
          accuracy = (@stats.shotsHit / @stats.shotsFired)
        else
          accuracy = 0.0

        score = Math.round(value * (accuracy + accuracy))
        cells.push "#{score}"
        @stats.bonus += score
      else
        cells.push ''
        cells.push ''
    @addCelledLine cells

  showEnemiesKilled: (level) ->
    cells = ['Enemies Killed']
    Crafty('Player').each ->
      if @has('ControlScheme')
        if @stats.enemiesKilled > 0 and level.data.enemiesSpawned > 0
          v = @stats.enemiesKilled / level.data.enemiesSpawned
          value = Math.round(v * 1000) / 10.0
        else
          value = 0.0
        cells.push "#{value}%"

        score = Math.round(value * 100)
        cells.push "#{score}"
        @stats.bonus += score
      else
        cells.push ''
        cells.push ''
    @addCelledLine cells

  showLives: (level) ->
    cells = ['Lives']
    Crafty('Player').each ->
      if @has('ControlScheme')
        value = @lives
        cells.push "#{value}"
        score = Math.round(value * 1000)
        cells.push "#{score}"
        @stats.bonus += score
      else
        cells.push ''
        cells.push ''
    @addCelledLine cells

  showWeaponXP: (level) ->
    cells = ['WeaponXP']
    Crafty('Player').each ->
      if @has('ControlScheme')
        value = @ship?.primaryWeapon?.xp ? 0
        cells.push "#{value}"
        score = Math.round(value * 10)
        cells.push "#{score}"
        @stats.bonus += score
      else
        cells.push ''
        cells.push ''
    @addCelledLine cells

  showTotals: (level) ->
    cells = ['Totals']
    Crafty('Player').each ->
      if @has('ControlScheme')
        cells.push ''
        cells.push @stats.bonus
        @addPoints @stats.bonus
        @stats.bonus = 0
      else
        cells.push ''
        cells.push ''
    @addCelledLine cells

  addCelledLine: (cells) ->
    @lineNr += 1

    y = 80 + (@lineNr * 20)

    xOffset = 70
    cellWidth = 500.0 / (cells.length + .5)
    for cell, i in cells
      cw = cellWidth
      cw += (cellWidth / 2.0) if i is 0
      if i is 0
        x = @x + xOffset
      else
        x = @x + xOffset + (cellWidth * (i + .5))

      c = Crafty.e('Text, DOM').attr(
        x: x
        y: y
        w: cw
        z: 3
      ).css 'textAlign', 'right'
        .text cell
        .textColor('#FFFFFF')
        .textFont({
          size: '12px',
          weight: 'normal',
          family: 'Courier new'
        })
      @attach c
      c2 = Crafty.e('Text, DOM').attr(
        x: x
        y: y + 2
        w: cw
        z: 2
      ).css 'textAlign', 'right'
        .text cell
        .textColor('#000000')
        .textFont({
          size: '12px',
          weight: 'bold',
          family: 'Courier new'
        })
      @attach c2


