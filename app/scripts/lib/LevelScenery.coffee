Game = @Game

##
# LevelScenery
#
# A part of a level that supplies terrain
#
# Each block uses this class as super class
#
# To create a piece of level, create a
# sub-class and implement one of these methods:
#
# - #generate
# - #enter
# - #inScreen
# - #leave
#
# and then register the new block at the LevelGenerator
#
# example:
#   class MyBlock extends Game.LevelScenery
#     ...
#   Game.levelGenerator.defineBlock MyBlock
#
##
class Game.LevelScenery
  screenHeight: 480

  constructor: (@level, @generator, @settings) ->
    @createdElements = []
    @createdBindings = []

  # calls the generate method,
  # and adds a trigger in the level
  # for notifications for #enter, #inScreen
  # and #leave
  build: (pos, index) ->
    return if @generated
    @x ?= pos.x
    @y ?= pos.y
    @index = index
    @generated = yes
    @generate()
    @_notifyEnterFunction index

  _notifyEnterFunction: (index) ->
    # TODO: Make this into a single component
    Crafty.e('2D, Canvas, Color, Collision')
      .attr({ x: @x, y: @y, w: 10, h: 800 })
      #.color('#FF00FF')
      .onHit 'ScrollFront', ->
        unless @triggeredFront
          Crafty.trigger('EnterBlock', index)
          @triggeredFront = yes
      .onHit 'PlayerControlledShip', ->
        unless @triggeredPlayerFront
          Crafty.trigger('PlayerEnterBlock', index)
          @triggeredPlayerFront = yes
      .onHit 'ScrollWall', ->
        @destroy()
        Crafty.trigger('LeaveBlock', index)

  # Generate terrain of the level
  generate: ->
    @settings.generate?.apply this

  # The Camera starts moving into this block.
  # the ideal moment to spawn enemies!
  enter: ->
    @settings.enter?.apply this

  playerEnter: ->
    @settings.playerEnter?.apply this

  playerLeave: ->
    @settings.playerLeave?.apply this

  # The block is fully in screen now, the left side
  # of the block is touching the left side of the screen
  # an ideal moment to speed up movement, show dialog, etc
  inScreen: ->
    @settings.inScreen?.apply this

  # The block is fully in screen now, the right side
  # of the block is touching the right side of the screen
  outScreen: ->
    @settings.outScreen?.apply this

  # The block is out of screen.
  leave: ->
    @settings.leave?.apply this

  # Gets called when the block is moved out of
  # screen, or the level stops.
  clean: ->
    e.destroy() for e in @createdElements
    @createdElements = []

    Crafty.unbind(b.event, b.callback) for b in @createdBindings
    @createdBindings = []

  # Helper method to add a entity to the level
  # on a positon relative to the placement of the
  # block in the level. Also registers the entity
  # for automatic cleanup.
  add: (x, y, element) ->
    element.attr x: @x + x, y: @y + y
    @createdElements.push element

  addBackground: (x, y, element, speed) ->
    element.addComponent('ViewportRelativeMotion').viewportRelativeMotion(
      x: @x + x
      y: @y + y
      speed: speed
    )
    @createdElements.push element

  addElement: (name) ->
    @generator.elements[name].apply this

  # Helper method to bind to an event in the game
  # and registers the bind for auto unbinding.
  bind: (event, callback) ->
    @createdBindings.push { event, callback }
    Crafty.bind(event, callback)

  unbind: (event) ->
    unbound = []
    for b in @createdBindings when b.event is event
      unbound.push b
      Crafty.unbind(b.event, b.callback)
    @createdBindings = _.without(@createdBindings, unbound...)

  canCleanup: ->
    cameraX = Crafty.viewport._x * -1
    return no if (@x + @delta.x) > cameraX
    for elem in @createdElements
      if elem.x + elem.w >= cameraX
        return no
    yes

