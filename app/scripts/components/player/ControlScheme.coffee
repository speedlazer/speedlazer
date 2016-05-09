Crafty.c 'ControlScheme',
  init: ->
    @addComponent('Cheats')
    @trigger('Activated')
    Crafty.trigger('PlayerActivated')

  remove: ->
    @removeComponent('Cheats')
    @trigger('Deactivated')
    Crafty.trigger('PlayerDeactivated')
