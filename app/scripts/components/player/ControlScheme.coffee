Crafty.c 'ControlScheme',
  init: ->
    @addComponent('Cheats') unless @has('Cheats')
    @trigger('Activated')
    Crafty.trigger('PlayerActivated')

  remove: ->
    @removeComponent('Cheats')
    @trigger('Deactivated')
    Crafty.trigger('PlayerDeactivated')
