[![Build Status](https://travis-ci.org/speedlazer/speedlazer.svg?branch=master)](https://travis-ci.org/speedlazer/speedlazer)

# SpeedLazer SHMUP

Development repo of a side scrolling shooter (SHMUP) made with Crafty.js and making use of the
HTML5 Gamepad API.

# Play

[Click here to play!](https://speedlazer.net)

To test if your gamepad is succesfully connected/working, use:
http://html5gamepad.com/

The latest `master` is automatically deployed to https://speedlazer.net/beta/

# More info:

Facebook: [@speedlazergame](https://facebook.com/speedlazergame)
Twitter: [@speedlazergame](https://twitter.com/speedlazergame)

[YouTube channel](https://www.youtube.com/channel/UCghWG8lQYJYig3oTPL3sbrQ)

[![YouTube Lunch and Learn](https://raw.githubusercontent.com/matthijsgroen/game-play/master/docs/images/youtube-2015-12-10.png)](http://www.theguild.nl/lunch-break-game-development)

# Setup for development

```
yarn install
yarn start
```

The game files are in `app/scripts`. The "Game" is in
`app/scripts/scenes/Game.coffee`. But it mainly runs DSL scripts,
located in `app/scripts/lazerscripts`

# License

The code is licensed under MIT (see LICENSE.txt).

The graphics/audio/music of the game are licensed
under a Creative Commons
`BY-NC-SA` [Attribution-NonCommercial-ShareAlike](http://creativecommons.org/licenses/by-nc-sa/4.0/) 4.0 International License.
(see app/images/LICENSE.txt)

