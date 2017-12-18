Crafty.c 'InventoryWeapons',
  init: ->

  stats: (newStats = {}) ->
    # TODO: Needs refactoring
    if newStats.primary?
      @primaryWeapon.stats = newStats.primary.stats
      #@primaryWeapon.boosts = newStats.primary.boosts
      #@primaryWeapon.boostTimings = newStats.primary.boostTimings
      @primaryWeapon._determineWeaponSettings()

    stats = {}
    stats['primary'] = {
      stats: @primaryWeapon?.stats ? {}
      boosts: @primaryWeapon?.boosts ? {}
      boostTimings: @primaryWeapon?.boostTimings ? {}
    }

    stats

  installItem: (item) ->
    return unless item?
    if item.type is 'weapon'
      return if @hasItem item.contains
      @items.push item

      if item.contains is 'lasers'
        @_installPrimary 'RapidWeaponLaser'
        return true

      if item.contains is 'oldlasers'
        @_installPrimary 'OldWeaponLaser'
        return true

      if item.contains is 'diagonals'
        @_installPrimary 'RapidDiagonalLaser'
        return true

    if item.type is 'ship'
      if item.contains is 'life'
        @scoreText 'Extra life!'
        return true
      if item.contains is 'points'
        @scoreText '+500 points!'
        return true
      if item.contains is 'xp'
        @primaryWeapon.addXP? 1000
        return true

    if item.type is 'weaponUpgrade'
      @primaryWeapon.upgrade item.contains
      return true

    if item.type is 'weaponBoost'
      @primaryWeapon.boost item.contains
      return true
