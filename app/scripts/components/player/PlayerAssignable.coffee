Crafty.c 'PlayerAssignable',
  init: ->
    @_attachControllerAssignTrigger()
    @preferredPlayer = null

  _assignControls: ->
    player = @_preferredplayer() || @_firstUnassignedPlayer()

    unless player?
      # Try again next time
      @_attachControllerAssignTrigger()
      return
    @preferredPlayer = player.getId()
    return unless player.credits > 0
    player.credits -= 1
    @setupControls(player)
    player.one 'Deactivated', =>
      @_attachControllerAssignTrigger()

  _attachControllerAssignTrigger: ->
    @one 'Fire', @_assignControls

  _preferredplayer: (preferred) ->
    if @preferredPlayer isnt null
      player = Crafty(@preferredPlayer)
      unless player.has('ControlScheme')
        return player

  _firstUnassignedPlayer: ->
    players = Crafty('Player')
    for playerId in players
      player = Crafty(playerId)
      return player unless player.has('ControlScheme')

