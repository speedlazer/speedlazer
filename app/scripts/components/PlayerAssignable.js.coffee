Crafty.c 'PlayerAssignable',
  init: ->
    @one 'Fire', @_assignControls
    @preferredPlayer = null

  _assignControls: ->
    player = @_playerWithoutControls(@preferredPlayer)

    unless player?
      # Try again next time
      @one('Fire', @_assignControls)
      return
    @preferredPlayer = player.getId()

    @setupControls(player)
    player.one 'Deactivated', =>
      @one('Fire', @_assignControls)

  _playerWithoutControls: (preferred) ->
    if preferred isnt null
      preferredPlayer = Crafty(preferred)
      unless preferredPlayer.has('ControlScheme')
        return preferredPlayer

    players = Crafty('Player')
    for playerId in players
      player = Crafty(playerId)
      return player unless player.has('ControlScheme')

Crafty.c 'ControlScheme',
  init: ->
    @trigger('Activated')
    Crafty.trigger('PlayerActivated')

  remove: ->
    @trigger('Deactivated')
    Crafty.trigger('PlayerDeactivated')
