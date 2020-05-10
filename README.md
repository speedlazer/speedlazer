[![Build Status](https://travis-ci.org/speedlazer/speedlazer.svg?branch=master)](https://travis-ci.org/speedlazer/speedlazer)

# SpeedLazer SHMUP

Development repo of a side scrolling shooter (SHMUP) made with Crafty.js and making use of the
HTML5 Gamepad API.

# Play

[Click here to play!](https://speedlazer.net) This is the 'engine 1'
version of the game. The current master branch contains the 'engine 2'
version, but that version is not yet playable.

To test if your gamepad is succesfully connected/working, use:
http://html5gamepad.com/

The latest `master` is automatically deployed to https://speedlazer.net/beta/

# Versioning:

- Major: Engine version (currently 2)
- Minor: Amount of content sections in game
- Patch: Fixes

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

The content scripts are in `src/scripts`. All other data is in
`src/data`. An editor/viewer is available locally, at `http://localhost:9000/editor.html`.

# License

The code is licensed under MIT (see LICENSE.txt).

The graphics/audio/music of the game are licensed
under a Creative Commons
`BY-NC-SA` [Attribution-NonCommercial-ShareAlike](http://creativecommons.org/licenses/by-nc-sa/4.0/) 4.0 International License.
(see app/images/LICENSE.txt)

