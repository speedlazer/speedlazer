Crafty.defineScene 'New', ->

  #Crafty.e('2D,DOM,Color').attr(
    #x: 10
    #y: 10
    #w: 20
    #h: 20
  #).color('#0000FF')

  Crafty.e('2D,Canvas,Color,Fourway').attr(
    x: 100
    y: 100
    w: 40
    h: 40
  ).color('#FF0000').fourway()

  #Crafty.e('2D,WebGL,Color,Fourway,Player').attr(
    #x: 10
    #y: 10
    #w: 20
    #h: 20
  #).color('#FF0000').fourway()

  #Crafty.e('2D,WebGL,Color,FooBar,Collision').attr(
    #x: 300
    #y: 200
    #w: 40
    #h: 40
    #z: 2
  #).color('#0000FF').onHit('Player', ->
    #@bind('TweenEnd', ->
      #@destroy()
    #)
    #@addComponent('Tween').tween(
      #w: 400
      #h: 400
      #x: 0
      #y: 0
      #alpha: 0.2
      #1000
    #)
  #)

->

