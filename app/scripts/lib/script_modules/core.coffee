Game = @Game
Game.ScriptModule ?= {}

Game.ScriptModule.Core =
  _verify: (sequence) ->
    throw new Error('sequence mismatch') unless sequence is @currentSequence

  sequence: (tasks...) ->
    (sequence) =>
      @_verify(sequence)
      WhenJS.sequence(tasks, sequence)

  parallel: (tasks...) ->
    (sequence) =>
      @_verify(sequence)
      WhenJS.parallel(tasks, sequence)

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
      new scriptClass(@level).run(args...)

  async: (task) ->
    (sequence) =>
      @_verify(sequence)
      task(sequence)
      return

  wait: (amount) ->
    (sequence) =>
      @_verify(sequence)
      d = WhenJS.defer()
      Crafty.e('Delay').delay(
        ->
          d.resolve()
          @destroy()
        amount
      )
      d.promise

