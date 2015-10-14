Game = @Game

class Game.LazerScript
  constructor: (@level) ->

  run: (args...) ->
    WhenJS(@execute(args...)())

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

  while: (condition, block) ->
    =>
      if condition.apply this
        WhenJS(block()).then =>
          @while(condition, block)()

  runScript: (scriptClass, args...) ->
    =>
      new scriptClass(@level).run(args...)

  runScriptAsync: (scriptClass, args...) ->
    =>
      new scriptClass(@level).run(args...)
      return

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

      @level.setForcedSpeed(x: currentSpeed, y: -speedY)
      level = @level
      Crafty.e('Delay').delay(
        ->
          level.setForcedSpeed(currentSpeed)
          d.resolve()
        options.duration
      )
      d.promise

  setSpeed: (speed) ->
    =>
      @level.setForcedSpeed speed

  showScore: ->
    =>
      score = @level.finishStage()
      @wait(15 * 2000)().then =>
        score.destroy()

  disableWeapons: ->
    =>
      @level.setWeaponsEnabled no

  enableWeapons: ->
    =>
      @level.setWeaponsEnabled yes

  # Enemy

  spawn: (constructor, label = 'default') ->
    =>
      @enemies ||= {}
      @enemies[label] = constructor()

  moveTo: (settings) ->
    defaults = {}
    =>
      @enemies ||= {}

      # TODO: Verify Choreography element
      enemy = @enemies[settings.enemy ? 'default']
      defaults.speed = enemy?.speed
      settings = _.defaults(settings, defaults)
      return unless enemy?
      delta = if settings.x? then (Math.abs(settings.x)) else 0
      delta += if settings.y? then (Math.abs(settings.y)) else 0

      defer = WhenJS.defer()
      enemy.choreography(
        [
          type: 'linear'
          x: settings.x
          y: settings.y
          maxSpeed: settings.speed
          duration: (delta / settings.speed)
        ]
      ).bind('ChoreographyEnd', ->
        @unbind('ChoreographyEnd')
        @unbind('Destroyed')
        defer.resolve()
      ).bind('Destroyed', =>
        delete @enemies[settings.enemy ? 'default']
        defer.resolve()
      )
      defer.promise

  location: (settings = {}) ->
    =>
      enemy = @enemies[settings.enemy ? 'default']
      { x: enemy.x, y: enemy.y }

  enemy: (name = 'default') ->
    {
      alive: @enemies[name]?
    }

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

