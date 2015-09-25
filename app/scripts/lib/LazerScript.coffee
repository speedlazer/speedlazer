Game = @Game

class Game.LazerScript
  run: (@level) ->
    @execute()()

  execute: ->

  # DSL Implementation

  # Core
  sequence: (tasks...) ->
    -> WhenJS.sequence(tasks)

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

  # Level
  say: (speaker, text) ->
    =>
      # TODO: Drastically simplify 'showDialog' when all scripts are working
      d = WhenJS.defer()
      @level.showDialog([":#{speaker}:#{text}"]).on('Finished', -> d.resolve())
      d.promise

  wave: (formation, options) ->
    =>
      enemyConstructor = @inventory('enemy', options.enemy)
      wave = @level.spawnEnemies('FlyOver', enemyConstructor)
      @wait(wave.duration)()

  drop: (options) ->
    =>
      item = @inventory('item', options.item)
      if player = options.inFrontOf
        @level.addComponent item(), x: 640, y: player.ship.y

  player: (nr) ->
    players = {}
    Crafty('Player').each ->
      players[@name] =
        active: no
        gameOver: no
        has: (item) ->
          @ship?.hasItem item

    Crafty('Player ControlScheme').each ->
      players[@name].active = yes
      players[@name].ship = @ship
      unless @lives > 0
        players[@name].active = no
        players[@name].gameOver = yes

    players["Player #{nr}"]

  inventory: (type, name) ->
    @invItems ||= {}
    @invItems[type] ||= {}
    @invItems[type][name || 'default']

  inventoryAdd: (type, name, constructor) ->
    @invItems ||= {}
    @invItems[type] ||= {}
    @invItems[type][name] = constructor

