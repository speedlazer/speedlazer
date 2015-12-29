Crafty.c 'TextInput',
  init: ->
    @requires '2D, DOM, Text'

  remove: ->

  textInput: (player, length) ->
    @defer = WhenJS.defer()

    name = 'A  '
    index = 0

    @text name

    player.bind 'Up', =>
      name = @_updateText(name, index, 1)
      @text name

    player.bind 'Down', =>
      name = @_updateText(name, index, -1)
      @text name

    player.bind 'Left', =>
      index = Math.max(index - 1, 0)
      @_updateCursor(index)

    player.bind 'Right', =>
      index = Math.min(index + 1, length - 1)
      @_updateCursor(index)

    player.bind 'Fire', =>
      player.unbind('Up')
      player.unbind('Down')
      player.unbind('Left')
      player.unbind('Right')
      @defer.resolve(name)

    @cursor = Crafty.e('2D, DOM, Text')
      .attr(x: @x, y: @y, w: @w)
      .text("_  ")
      .textColor('#0000FF')
      .css("textAlign", "left")
      .textFont({
        size: '20px'
        weight: 'bold'
        family: 'Press Start 2P'
      })
    @attach @cursor

    @defer.promise

  _updateCursor: (index) ->
    c = Array(index + 1).join('&nbsp;') + '_'
    @cursor.text(c)


  _updateText: (name, index, movement) ->
    chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890!$ '

    letter = name[index]
    lindex = chars.indexOf(letter) + chars.length
    nletter = chars[(lindex + movement) % chars.length]
    name.slice(0, index) + nletter + name.slice(index + 1)


