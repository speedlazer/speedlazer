Crafty.c 'ControlScheme',
  init: ->
    #debugger
    @trigger('Activated')
    Crafty.trigger('PlayerActivated')

  remove: ->
    @trigger('Deactivated')
    Crafty.trigger('PlayerDeactivated')
