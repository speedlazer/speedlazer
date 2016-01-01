Crafty.c 'StageEnd',
  init: ->
    @requires '2D, WebGL, HUD, Delay, Color'

  stageEnd: (level, stage, title) ->
    @lineNr = 0

    this.attr(
      w: 580
      h: 200
      alpha: 0.2
    )
    .positionHud(
      x: 40
      y: 130
      z: 90
    )
    .color('#000000')

    c = Crafty.e('Text, DOM').attr(
      x: @x
      y: @y + 10
      w: @w
      z: 91
    ).css 'textAlign', 'center'
      .text "Stage #{stage} Cleared: #{title}"
      .textColor('#FFFFFF')
      .textFont({
        size: '12px'
        weight: 'bold'
        family: 'Press Start 2P'
      })
    @attach c

    @delay((i) ->
      switch @lineNr
        when 0
          @showPlayerHeaders()
          @showAccuracy level
        when 2 then @showShotsFired level
        when 3 then @showEnemiesKilled level
        when 4 then @showLives level
        when 5 then @showWeaponXP level
        when 6 then @showTotals level
    , 2000, 6)

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
        cells.push score
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
        cells.push score
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
        cells.push score
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
        cells.push score
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
        cells.push score
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

    y = @y + 20 + (@lineNr * 20)

    xOffset = 0
    cellWidth = 500.0 / (cells.length + .5)
    for cell, i in cells
      do (cell, i) =>
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
            size: '8px'
            weight: 'normal'
            family: 'Press Start 2P'
          })

        if i in [2, 4] and typeof cell is 'number'
          c.attr endScore: cell, v: 0
          c.text c.v
          c.bind 'GameLoop', (fd) ->
            @v += (fd.dt * 3) + 3
            if @v > @endScore
              @v = @endScore
              @unbind 'GameLoop'
            @text @v

        @attach c


