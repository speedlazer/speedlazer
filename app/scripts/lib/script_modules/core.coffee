Game = @Game
Game.ScriptModule ?= {}

Game.ScriptModule.Core =
  _verify: (sequence) ->
    throw new Error('sequence mismatch') unless sequence is @currentSequence

  _skippingToCheckpoint: ->
    @startAtCheckpoint? and @currentCheckpoint < @startAtCheckpoint

  # Runs a sequence of steps:
  # example:
  #   @sequence(
  #     @moveTo(x: 30)
  #     @moveTo(y: 50)
  #   )
  sequence: (tasks...) ->
    (sequence) =>
      @_verify(sequence)
      WhenJS.sequence(tasks, sequence)

  # Runs steps in parallel, and completes when the last branch has finished
  # example:
  #   @parallel(
  #     @placeSquad Game.Scripts.EnemyType1
  #     @placeSquad Game.Scripts.EnemyType2
  #   )
  parallel: (tasks...) ->
    (sequence) =>
      @_verify(sequence)
      WhenJS.parallel(tasks, sequence)

  # Executes step conditionally
  # example:
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

  while: (condition, block) ->
    (sequence) =>
      @_verify(sequence)
      if block is undefined
        block = condition
        condition = -> true

      if condition.apply this
        WhenJS(block(sequence)).then =>
          @while(condition, block)(sequence)

  repeat: (times, block) ->
    (sequence) =>
      @_verify(sequence)
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

  runScript: (scriptClass, args...) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      new scriptClass(@level).run(args...)

  async: (task) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      task(sequence)
      return

  wait: (amount) ->
    (sequence) =>
      @_verify(sequence)
      return WhenJS() if @_skippingToCheckpoint()
      d = WhenJS.defer()
      Crafty.e('Delay').delay(
        ->
          d.resolve()
          @destroy()
        amount
      )
      d.promise

  endSequence: ->
    (sequence) =>
      @_verify(sequence)
      throw new Error('sequence aborted')

  checkpoint: (task) ->
    (sequence) =>
      @_verify(sequence)
      @currentCheckpoint += 1
      return WhenJS() if @_skippingToCheckpoint()
      if @currentCheckpoint is @startAtCheckpoint and task?
        task(sequence)
