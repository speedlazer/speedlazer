Game = @Game
Game.ScriptModule ?= {}

# Core scripting mechanics. Mainly Controlflow statements
#
#  - sequence
#  - parallel
#  - if
#  - while
#  - repeat
#  - runScript
#  - async
#  - wait
#  - checkpoint
#
Game.ScriptModule.Core =
  _verify: (sequence) ->
    throw new Error('sequence mismatch') unless sequence is @currentSequence
    @level.verify()

  _skippingToCheckpoint: ->
    @startAtCheckpoint? and @currentCheckpoint < @startAtCheckpoint

  # Runs a sequence of steps.
  # example:
  #
  #   @sequence(
  #     @moveTo(x: 30)
  #     @moveTo(y: 50)
  #   )
  sequence: (tasks...) ->
    (sequence) =>
      @_verify(sequence)
      WhenJS.sequence(tasks, sequence)

  # Runs steps in parallel, and completes when the last branch has finished.
  # example:
  #
  #   @parallel(
  #     @placeSquad Game.Scripts.EnemyType1
  #     @placeSquad Game.Scripts.EnemyType2
  #   )
  parallel: (tasks...) ->
    (sequence) =>
      @_verify(sequence)
      WhenJS.parallel(tasks, sequence)

  # Executes step conditionally.
  # example:
  #
  #   @if((=> Math.random() > 0.5),
  #     @sequence(...)
  #   # else
  #     @sequence(...)
  #   )
  if: (condition, block, elseBlock) ->
    (sequence) =>
      @_verify(sequence)
      if condition.apply this
        block(sequence)
      else
        elseBlock?(sequence)

  # Repeat until condition is met.
  # example:
  #
  #   @while((=> Math.random() > 0.5),
  #     @sequence(...)
  #   )
  #
  # if no condition is provided, it will
  # loop forever. (see `repeat`)
  while: (condition, block) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      if block is undefined
        block = condition
        condition = ->
          # Never resolving promise
          d = WhenJS.defer()
          d.promise

      whileResolved = no
      condition(sequence)
        .catch (e) ->
          throw e unless e.message is 'sequence mismatch'
        .finally -> whileResolved = yes
      WhenJS.iterate(
        -> 1
        -> whileResolved
        -> block(sequence)
        1
      )

  # Repeat forever or amount of times.
  # example for infinite repeat (see `while`):
  #
  #   @repeat @placeSquad Game.Scripts.EnemyType1
  #
  # example:
  #
  #   @repeat 3, @placeSquad Game.Scripts.EnemyType1
  repeat: (times, block) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      # Syntactic sugar:
      # this allows for writing
      # @repeat(@sequence( ...
      #
      # which feels more natural
      # that a @while without a condition
      if block is undefined
        return @while(times)(sequence)

      return if times is 0
      WhenJS(block(sequence)).then =>
        @repeat(times - 1, block)(sequence)

  # Run a subscript, and continue after completion.
  # example:
  #
  #   @runScript Game.Scripts.EnemyType1, argsForScript...
  runScript: (scriptClass, args...) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      new scriptClass(@level).run(args...)

  # Execute a task, but don't wait for results.
  async: (task) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      task(sequence)
      return

  # Wait an amount of milliseconds.
  wait: (amount) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      d = WhenJS.defer()

      duration = Math.max(amount?() ? amount, 0)
      parts = duration // 40
      Crafty.e('Delay').delay(
        =>
          try
            @_verify(sequence)
          catch e
            d.reject e
          return
        40
        parts
        ->
          d.resolve()
          @destroy()
      )
      d.promise

  # Stops the current script chain.
  endSequence: ->
    (sequence) =>
      @_verify(sequence)
      throw new Error('sequence mismatch')

  # Define a checkpoint.
  # When the user starts at this checkpoint,
  # the provided task is executed.
  #
  # Typically, this task sets the correct background,
  # provides a small delay to ease the player in the gameplay
  # and could provide some powerups.
  checkpoint: (task) ->
    (sequence) =>
      @_verify(sequence)
      @currentCheckpoint += 1
      return WhenJS() if @_skippingToCheckpoint()
      if @currentCheckpoint is @startAtCheckpoint and task?
        task(sequence)
      else
        window.ga('send', 'event', 'Game', "Checkpoint #{@currentCheckpoint}")
