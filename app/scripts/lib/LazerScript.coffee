Game = @Game

class Game.LazerScript
  run: (@level) ->
    @execute()()

  execute: ->

  # DSL Implementation

  # Core
  sequence: (tasks...) ->
    -> WhenJS.sequence(tasks)

  parallel: (tasks...) ->
    -> WhenJS.parallel(tasks)

  if: (condition, block, elseBlock) ->
    =>
      if condition.apply this
        block()
      else
        elseBlock?()

  wait: (amount) ->
    =>
      d = WhenJS.defer()
      Crafty.e('Delay').delay(
        ->
          d.resolve()
          @destroy()
        amount
      )
      d.promise

  repeat: (times, event) ->
    =>
      return if times is 0
      event().then =>
        @repeat(times - 1, event)()

  # Level
  say: (speaker, text) ->
    =>
      # TODO: Drastically simplify 'showDialog' when all scripts are working
      d = WhenJS.defer()
      @level.showDialog([":#{speaker}:#{text}"]).on('Finished', -> d.resolve())
      d.promise

  wave: (formation, options = {}) ->
    =>
      enemyConstructor = @inventory('enemy', options.enemy)
      wave = @level.spawnEnemies(formation, enemyConstructor)
      if options.drop
        wave.on 'LastDestroyed', (last) =>
          @drop(item: options.drop, location: last)()

      # TODO: Any - Wait, Kill
      @wait(wave.duration)()

  drop: (options) ->
    =>
      item = @inventory('item', options.item)
      if player = options.inFrontOf
        @level.addComponent item().attr(z: -1), x: 640, y: player.ship().y
      if pos = options.location
        item().attr(x: pos.x, y: pos.y, z: -1)

  player: (nr) ->
    players = {}
    Crafty('Player').each ->
      players[@name] =
        name: @name
        active: no
        gameOver: no
        has: (item) ->
          @ship()?.hasItem item
        ship: ->
          _this = this
          ship = null
          Crafty('Player ControlScheme').each ->
            ship = @ship if @name is _this.name
          ship

    Crafty('Player ControlScheme').each ->
      players[@name].active = yes
      unless @lives > 0
        players[@name].active = no
        players[@name].gameOver = yes

    players["Player #{nr}"]

  setScenery: (scenery) ->
    => @level.setScenery scenery

  waitForScenery: (sceneryType, options = { event: 'enter' }) ->
    =>
      d = WhenJS.defer()
      @level.notifyScenery options.event, sceneryType, -> d.resolve()
      d.promise

  gainHeight: (height, options) ->
    =>
      d = WhenJS.defer()

      currentSpeed = @level._forcedSpeed?.x || @level._forcedSpeed
      { duration } = options
      speedY = (height / ((duration / 1000.0) * Crafty.timer.FPS()))
      console.log speedY

      @level.setForcedSpeed(x: currentSpeed, y: -speedY)
      level = @level
      Crafty.e('Delay').delay(
        ->
          level.setForcedSpeed(currentSpeed)
          d.resolve()
        options.duration
      )
      d.promise

  showScore: ->
    =>
      score = @level.finishStage()
      @wait(15 * 2000)().then =>
        score.destroy()

  # Inventory
  # TODO: Decide how we handle inventory thoughout game

  inventory: (type, name) ->
    @invItems ||= {}
    @invItems[type] ||= {}
    @invItems[type][name || 'default']

  inventoryAdd: (type, name, constructor) ->
    @invItems ||= {}
    @invItems[type] ||= {}
    @invItems[type][name] = constructor

