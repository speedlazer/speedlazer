# SpeedLazer SHMUP

Development repo of a side scrolling shooter (SHMUP) made with Crafty.js and making use of the
HTML5 Gamepad API.

# Play

[Click here to play!](http://matthijsgroen.github.io/game-play/dist/index.html)

To test if your gamepad is succesfully connected/working, use:
http://html5gamepad.com/

# More info:

Facebook: [@speedlazergame](https://facebook.com/speedlazergame)
Twitter: [@speedlazergame](https://twitter.com/speedlazergame)
[YouTube channel](https://www.youtube.com/channel/UCghWG8lQYJYig3oTPL3sbrQ)

[![YouTube Lunch and Learn](https://raw.githubusercontent.com/matthijsgroen/game-play/master/images/youtube-2015-12-10.png)](http://www.theguild.nl/lunch-break-game-development)

# Setup for development

Make sure you have the [Live reload Chrome
plugin](https://chrome.google.com/webstore/detail/livereload/jnihajbhpnppcggbcgedagnkighmdlei)

```
npm install
bower install
grunt serve
```

The game files are in `app/scripts`. The "Game" is in
`app/scripts/scenes/Game.coffee`. But it mainly runs DSL scripts,
located in `app/scripts/lazerscripts`

# Building a game from scratch

See: https://github.com/sgmeyer/generator-crafty

```
npm install -g yo bower grunt-cli gulp
npm install -g generator-crafty
yo crafty
echo "node_modules" >> .gitignore
echo "bower_components" >> .gitignore
```

# License

The code is licensed under MIT (see LICENSE.txt).

The graphics/audio/music of the game are licensed
under a Creative Commons
`BY-NC-SA` [Attribution-NonCommercial-ShareAlike](http://creativecommons.org/licenses/by-nc-sa/4.0/) 4.0 International License.
(see app/images/LICENSE.txt)

