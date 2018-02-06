# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [2.0.0 - Unreleased] - TBD
### Added
- Analog control feel for keyboard controls
- Lots of extra attack patterns in bossfight under the bridge
- New mid-stage bossfight against big navy battleship

### Changed
- Way the game world is build up. Scenery is now moving, and
  Camera is fixed
- Build process is now through Webpack (i.s.o. Grunt)
- New screenshake calculations
- New collision system for ship, allowing ships to be pushed
  away again
- Bridge collapse is now more integral part of the bossfight
- Redevided the stage boundaries. Stage 1 now ends after bossfight
  under the bridge
- Water particles are rewritten, resulting in a better performance
- Updated Crafty to 0.9.0-rc.1
- Starting weapon is now maxed out by default
- Hitflashes on enemies are now full white

### Removed
- Bullet patterns of boss, it didn't fit with the character
- Powerups, does not add anything with new weapon settings

### Fixed
- Issue where chapter titles where shown over the pause menu

## [1.2.0] - 2017-12-12
### Added
- Added a graphical ship for intro section
- Adds a Droneship releasing drones

### Changed
- First boss is now quicker with changing attack patterns
- First boss now also shoots bullet rings upon fase change / dying
- Players shoot bullets in their color now, to reduce confusion
- Show a 'Get Ready' at stage 2 before enemies appear
