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

  player: (nr) ->
    players = {}
    players["Player #{nr}"] = { active: no, gameOver: no }
    Crafty('Player ControlScheme').each ->
      players[@name] = { active: yes, gameOver: no }
      unless @lives > 0
        players[@name] = { active: no, gameOver: yes }
    players["Player #{nr}"]

