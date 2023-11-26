[![Play in browser](https://img.shields.io/badge/play-browser-yellowgreen)](https://speedlazer.net)
[![Play on itch.io](https://img.shields.io/badge/play-itch.io-yellowgreen)](https://thaisi.itch.io/speedlazer)
[![Build Status](https://travis-ci.org/speedlazer/speedlazer.svg?branch=master)](https://travis-ci.org/speedlazer/speedlazer)
![GitHub package.json version](https://img.shields.io/github/package-json/v/speedlazer/speedlazer)

# SpeedLazer SHMUP

Development repo of a side scrolling shooter (SHMUP) made with Crafty.js and making use of the
HTML5 Gamepad API.

# Controls

You can use the arrow-keys/WSAD and space to control the spaceship, or use a gamepad.

To test if your gamepad is succesfully connected/working, use:
http://html5gamepad.com/

The latest `master` is automatically deployed to https://speedlazer.net/beta/  
The 2016 version is still playable at https://speedlazer.net/v1/


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
`src/data`. 

An editor/viewer is available locally:

```
yarn start-editor
open http://localhost:1235/editor.html
```

# License

The code is licensed under MIT (see LICENSE.txt).

The graphics/audio/music of the game are licensed
under a Creative Commons
`BY-NC-SA` [Attribution-NonCommercial-ShareAlike](http://creativecommons.org/licenses/by-nc-sa/4.0/) 4.0 International License.
(see app/images/LICENSE.txt)

