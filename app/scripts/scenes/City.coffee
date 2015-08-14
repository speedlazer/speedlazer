Crafty.defineScene 'City', (data) ->

  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#602020')

  level = Game.levelGenerator.createLevel
    stage: data.stage
    title: 'City'

  level.addBlock 'City.Ocean',
    enter: ->
      text = "Stage #{@level.data.stage}: #{@level.data.title}"
      Crafty.e('StageTitle').stageTitle(text)

      @level.showDialog([
        'p1,p2:John:Too bad we have to bring these babies to the museum!'
        'p1,!p2:John:Too bad we have to bring this baby to the museum!'
        ':General:Just give her a good last flight,\nwe document some moves on the way!'
      ])

  level.addBlock 'City.Ocean'

  level.addBlock 'City.Ocean',
    enter: ->
      @level.showDialog([
        ':General:Evade the upcoming drones!'
      ]).on 'Finished', =>
        @level.spawnEnemies(
          'FlyOver'
          'Enemy'
        )

  #level.generateBlocks amount: 2

  level.addBlock 'City.Ocean',
    generate: ->
    enter: ->
      @level.showDialog([
        ':General:We dropped an upgrade to show the weapon systems'
      ]).on 'Finished', =>
        @level.addComponent Crafty.e('PowerUp').powerUp(contains: 'lasers'), x: 640, y: 300


  level.generateBlocks
    amount: 2
    inScreen: ->
      @level.spawnEnemies(
        'FlyOver'
        'Enemy'
      ).on 'LastDestroyed', (last) ->
        Crafty.e('PowerUp').powerUp(contains: 'lasers').attr(
          x: last.x
          y: last.y
          z: -1
        )

  level.addBlock 'GameplayDemo.End'

  level.start(armedPlayers: no)

  v = 0
  co =
    r: 0x60
    g: 0x20
    b: 0x20
  cd =
    r: 0x80
    g: 0x80
    b: 0xFF

  steps = 160
  Crafty.e('Delay').delay(
    =>
      v += 1
      p = v * 1.0 / steps
      c =
        r: co.r * (1 - p) + cd.r * p
        b: co.b * (1 - p) + cd.g * p
        g: co.g * (1 - p) + cd.b * p
      cs = (i.toString(16).slice(0, 2) for k, i of c)

      Crafty.background("##{cs.join('')}")
  , 500, steps - 1)

  duration = steps * 500 * 2

  Crafty.e('Sun')
    .sun(
      x: 620
      y: 410
    )
    .tween({ dy: -340, dx: 120 }, duration)

  Crafty.bind 'EndOfLevel', ->
    level.stop()
    Crafty.enterScene('GameplayDemo', { stage: data.stage + 1 })

  Crafty.bind 'PlayerDied', ->
    playersActive = no
    Crafty('Player ControlScheme').each ->
      playersActive = yes if @lives > 0

    unless playersActive
      level.stop()
      Crafty.enterScene('GameOver')

, ->
  # destructor
  Crafty('Delay').each -> @destroy()
  Crafty.unbind('PlayerDied')
  Crafty.unbind('EndOfLevel')
  Crafty('Player').each -> @removeComponent('ShipSpawnable')
