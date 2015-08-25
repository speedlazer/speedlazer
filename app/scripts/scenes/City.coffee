Crafty.defineScene 'City', (data) ->

  # import from globals
  Game = window.Game

  # constructor
  Crafty.background('#602020')

  level = Game.levelGenerator.createLevel
    stage: data.stage
    title: 'City'

  level.addBlock 'City.Intro',
    enter: ->
      text = "Stage #{@level.data.stage}: #{@level.data.title}"
      Crafty.e('StageTitle').stageTitle(text)

      @level.showDialog([
        'p1,p2:John:Too bad we have to bring these ships to the museum!'
        'p1,!p2:John:Too bad we have to bring this ship to the museum!'
        ':General:Just give her a good last flight,\nwe document some moves on the way!'
      ])

  level.addBlock 'City.Ocean'

  level.addBlock 'City.Ocean',
    enter: ->
      @level.showDialog([
        ':general:Evade the upcoming drones!'
      ]).on 'Finished', =>
        @level.spawnEnemies(
          'FlyOver'
          -> Crafty.e('Drone').drone()
        )

  level.addBlock 'City.Ocean',
    generate: ->
    enter: ->
      @level.showDialog([
        ':General:We dropped an upgrade to show the weapon systems'
      ]).on 'Finished', =>
        @level.addComponent Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L'), x: 640, y: 300
        if Crafty('PlayerControlledShip').length > 1
          @level.addComponent Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L'), x: 640, y: 100

  level.generateBlocks
    amount: 2
    enter: ->
      @level.spawnEnemies(
        'FlyOver'
        -> Crafty.e('Drone').drone()
      ).on 'LastDestroyed', (last) ->
        Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').attr(
          x: last.x
          y: last.y
          z: -1
        )

  level.generateBlocks
    amount: 1
    enter: ->
      @level.spawnEnemies(
        'Splash'
        -> Crafty.e('BackgroundDrone').drone()
      ).on 'LastDestroyed', (last) =>
        @level.showDialog([
          ':General:Wtf is happening with our drones?'
        ]).on 'Finished', =>
          @level.spawnEnemies(
            'FlyOver'
            -> Crafty.e('Drone,Weaponized').drone()
          ).on 'LastDestroyed', (last) ->
            Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').attr(
              x: last.x
              y: last.y
              z: -1
            )

  level.generateBlocks
    amount: 1
    enter: ->
      @level.showDialog([
        ':General:Their AI has been compromised by our rogue prototype!\nEliminate it!'
        'p1:John:How?'
        'p2,!p1:Jack:What the...'
        ':General:It\'s hiding in the city! go!'
      ])

  level.generateBlocks
    amount: 8
    enter: ->
      console.log 'spawn!'
      @level.spawnEnemies(
        'FlyOver'
        -> Crafty.e('Drone,Weaponized').drone()
      ).on 'LastDestroyed', (last) ->
        Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').attr(
          x: last.x
          y: last.y
          z: -1
        )
    at: (x) ->
      if x is 320
        console.log 'Extra spawn!'
        @level.spawnEnemies(
          'FlyOver'
          -> Crafty.e('Drone,Weaponized').drone()
        ).on 'LastDestroyed', (last) ->
          Crafty.e('PowerUp').powerUp(contains: 'lasers', marking: 'L').attr(
            x: last.x
            y: last.y
            z: -1
          )

  level.addBlock 'GameplayDemo.End',
    enter: ->
      @level.showDialog([
        ':Game:This is it for now.. More content coming soon!\nStarting test level...'
      ])

  level.start
    #armedPlayers: no
    speed: 0
    viewport:
      x: 0
      y: 120


  ##
  # Setup the recoloring background to show a dawn in progress
  v = 0

  # origin
  co =
    r: 0x60
    g: 0x20
    b: 0x20

  # destination
  cd =
    r: 0x80
    g: 0x80
    b: 0xFF

  steps = 320
  delay = 1000
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
  , delay, steps - 1)

  duration = steps * delay * 2

  Crafty.e('Sun')
    .sun(
      x: 620
      y: 410
    )
    .tween({ dy: -340, dx: 120 }, duration)

  Crafty.bind 'EndOfLevel', ->
    level.stop()
    Crafty.enterScene('GameplayDemo', { stage: data.stage + 1 })

  # TODO: Extract this to 'level'
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
