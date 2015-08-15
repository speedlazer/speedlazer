Crafty.c 'ControlScheme',
  init: ->
    @trigger('Activated')
    Crafty.trigger('PlayerActivated')

  remove: ->
    @trigger('Deactivated')
    Crafty.trigger('PlayerDeactivated')
