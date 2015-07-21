# Side scrolling shooter!

Development repo of HTML5 game made with Crafty.js and making use of the
HTML5 Gamepad API.


To try it out: http://matthijsgroen.github.io/game-play/dist/index.html

## Controls

Keyboard 1:

`↑`, `↓`, `←`, `→`: Movement
`Space`: Fire

Keyboard 2:
`w`, `s`, `a`, `d`: Movement
`g`: Fire

Gamepad 1 & Gamepad 2:
D-Pad or Left Stick: Movement
`Button A`: Fire

To test if your gamepad is succesfully connected/working, use:
http://html5gamepad.com/


# Comments, Ideas, Suggestions or Bugs?

https://github.com/matthijsgroen/game-play/issues


# Setup for development

```
npm install
bower install
```


# Building a game from scratch

See: https://github.com/sgmeyer/generator-crafty

```
npm install -g yo bower grunt-cli gulp
npm install -g generator-crafty
yo crafty
echo "node_modules" >> .gitignore
echo "bower_components" >> .gitignore
```

