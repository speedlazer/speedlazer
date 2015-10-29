Crafty.c 'Drone',
  init: ->
    @requires 'Color, Enemy'

  drone: (attr = {}) ->
    @attr _.defaults(attr,
      w: 25, h: 25, health: 300)
    @origin 'center'
    @color '#0000FF'

    @enemy()

    #if @has('Weaponized')
      #@bind 'Shoot', =>
        #@shooting = Crafty.e('Delay').delay(
          #=>
            #Crafty.e('2D,Canvas,Color,Enemy,Tween').attr(
              #x: @x - @w
              #y: @y + (@h / 2)
              #w: 6
              #h: 6
            #).color('#FFFF00').tween(
              #x: @x - 640
              #2000
            #)
        #, 1500, 5)
    this

  #remove: ->
    #@shooting.destroy() if @shooting?
