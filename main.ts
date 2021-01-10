namespace SpriteKind {
    export const Bomb = SpriteKind.create()
    export const Explosion = SpriteKind.create()
    export const Door = SpriteKind.create()
    export const ExplosionRangeUp = SpriteKind.create()
}
function placeBomb () {
    bombSprite = sprites.create(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . 2 . . . . 
        . . . . . . . . . . 5 . . . . . 
        . . . . . . . . . . e . . . . . 
        . . . . . 1 1 f f e f . . . . . 
        . . . . 1 c c f f e f f . . . . 
        . . . 1 c c f f f f f f f . . . 
        . . . 1 c f f f f f f f f . . . 
        . . . 1 f f f f f f f f f . . . 
        . . . f f f f f f f f f f . . . 
        . . . f f f f f f f f f f . . . 
        . . . f f f f f f f c f f . . . 
        . . . . f f f f f c f f . . . . 
        . . . c c f f f f f f c c . . . 
        . . . . c c c c c c c c . . . . 
        . . . . . . . . . . . . . . . . 
        `, SpriteKind.Bomb)
    sprites.setDataNumber(bombSprite, "explosionRange", explosionRange)
    bombSprite.lifespan = 3000
    tiles.placeOnTile(bombSprite, tiles.locationOfSprite(bombermanSprite))
    tiles.setWallAt(tiles.locationOfSprite(bombSprite), true)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.ExplosionRangeUp, function (sprite, otherSprite) {
    otherSprite.destroy(effects.ashes, 500)
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    explosionRange += 1
})
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    placeBomb()
})
sprites.onDestroyed(SpriteKind.Bomb, function (sprite) {
    tiles.setWallAt(tiles.locationOfSprite(sprite), false)
    explosionSprite = sprites.create(img`
        . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
        . 5 5 2 3 1 1 1 1 1 1 3 2 5 5 . 
        5 5 2 2 3 1 1 1 1 1 1 3 2 2 5 5 
        2 2 2 3 3 1 1 1 1 1 1 3 3 2 2 2 
        3 3 3 3 1 1 1 1 1 1 1 1 3 3 3 3 
        3 1 1 1 1 1 1 1 1 1 1 1 1 1 1 3 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        3 1 1 1 1 1 1 1 1 1 1 1 1 1 1 3 
        3 3 3 3 1 1 1 1 1 1 1 1 3 3 3 3 
        2 2 2 3 3 1 1 1 1 1 1 3 3 2 2 2 
        5 5 2 2 3 1 1 1 1 1 1 3 2 2 5 5 
        . 5 5 2 3 1 1 1 1 1 1 3 2 5 5 . 
        . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
        `, SpriteKind.Explosion)
    tiles.placeOnTile(explosionSprite, tiles.locationOfSprite(sprite))
    explosionSprite.z = 1
    explosionSprite.lifespan = 3000
    bombExplodeLeft(sprite, sprites.readDataNumber(sprite, "explosionRange"))
    bombExplodeTop(sprite, sprites.readDataNumber(sprite, "explosionRange"))
    bombExplodeRight(sprite, sprites.readDataNumber(sprite, "explosionRange"))
    bombExplodeBottom(sprite, sprites.readDataNumber(sprite, "explosionRange"))
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Explosion, function (sprite, otherSprite) {
    game.over(false)
})
function bombExplodeTop (sprite: Sprite, depth: number) {
    if (sprite.tileKindAt(TileDirection.Top, sprites.builtin.brick)) {
        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Top), myTiles.tile1)
        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Top), false)
        if (Math.percentChance(100 / (tiles.getTilesByType(sprites.builtin.brick).length + 1))) {
            doorFound = true
            doorSprite = sprites.create(img`
                7 7 7 7 7 9 9 8 9 1 1 7 7 7 7 7 
                7 7 7 7 9 1 8 1 1 8 8 7 7 7 7 7 
                7 7 7 9 8 8 1 9 8 9 9 1 7 7 7 7 
                7 7 9 1 8 1 9 9 8 1 8 8 1 7 7 7 
                7 7 9 1 8 9 1 1 8 8 9 9 8 7 7 7 
                7 7 9 8 8 9 1 8 8 9 1 1 9 8 7 7 
                7 7 1 9 8 8 9 1 8 8 8 8 9 1 1 7 
                7 9 8 8 9 8 8 9 1 8 9 8 8 9 1 7 
                7 9 9 8 8 9 8 1 8 1 8 8 9 8 1 7 
                7 1 9 9 8 8 8 1 9 8 9 8 1 1 8 7 
                7 7 8 9 9 8 1 8 1 8 8 8 8 1 7 7 
                7 7 7 8 8 1 9 8 9 8 8 1 9 8 7 7 
                7 7 7 7 1 9 8 9 1 8 8 8 1 1 7 7 
                7 7 7 8 8 8 9 1 8 1 8 1 8 7 7 7 
                7 7 7 7 8 1 1 9 8 9 9 1 7 7 7 7 
                7 7 7 7 7 7 1 8 9 1 1 7 7 7 7 7 
                `, SpriteKind.Door)
            tiles.placeOnTile(doorSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Top))
        }
        if (explosionRange < 5) {
            if (Math.percentChance(50)) {
                explosionRangeUpSprite = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                    . a d d d d d d d d d d d d a . 
                    . d d c c c 2 c c 2 c 2 2 2 d . 
                    . d c c c c 2 c c 2 c 2 . 2 d . 
                    . d c c c c 2 c c 2 c 2 2 2 d . 
                    . d c c c c 2 c c 2 c 2 c c d . 
                    . d c c c 5 5 2 2 c c 2 c c d . 
                    . d c c 5 2 2 5 c c c c c c d . 
                    . d c 5 2 3 3 2 5 c c c c c d . 
                    . d 5 2 3 1 1 3 2 5 c c c c d . 
                    . d 5 2 3 1 1 3 2 5 c c c c d . 
                    . d c 5 2 3 3 2 5 c c c c c d . 
                    . d c c 5 2 2 5 c c c c c c d . 
                    . d c c c 5 5 c c c c c c c d . 
                    . a d d d d d d d d d d d d a . 
                    . . . . . . . . . . . . . . . . 
                    `, SpriteKind.ExplosionRangeUp)
                tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Top))
            }
        }
    } else {
        if (!(sprite.tileKindAt(TileDirection.Top, sprites.dungeon.floorLight2))) {
            if (depth == 1) {
                explosionSprite = sprites.create(img`
                    . . . . . 5 5 5 5 5 5 . . . . . 
                    . . . . 5 5 5 2 2 5 5 5 . . . . 
                    . . . 5 5 5 2 2 2 2 5 5 5 . . . 
                    . . 5 5 5 2 2 3 3 2 2 5 5 5 . . 
                    . . 5 5 2 2 3 3 3 3 2 2 5 5 . . 
                    . . 5 5 2 3 3 1 1 3 3 2 5 5 . . 
                    . . 5 5 2 3 1 1 1 1 3 2 5 5 . . 
                    . . 5 2 2 3 1 1 1 1 3 2 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    `, SpriteKind.Explosion)
                explosionSprite.z = 1
                explosionSprite.lifespan = 3000
                tiles.placeOnTile(explosionSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Top))
            } else {
                explosionSprite = sprites.create(img`
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    `, SpriteKind.Explosion)
                explosionSprite.z = 1
                explosionSprite.lifespan = 3000
                tiles.placeOnTile(explosionSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Top))
                bombExplodeTop(explosionSprite, depth - 1)
            }
        }
    }
}
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Player, function (sprite, otherSprite) {
    game.over(false)
})
// handling left side explosion
function bombExplodeLeft (sprite: Sprite, depth: number) {
    if (sprite.tileKindAt(TileDirection.Left, sprites.builtin.brick)) {
        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Left), myTiles.tile1)
        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Left), false)
        if (Math.percentChance(100 / (tiles.getTilesByType(sprites.builtin.brick).length + 1))) {
            doorFound = true
            doorSprite = sprites.create(img`
                7 7 7 7 f 9 9 8 9 1 1 f 7 7 7 7 
                7 7 7 f 9 1 8 1 1 8 8 f f 7 7 7 
                7 7 f f 8 8 1 9 8 9 9 1 f f 7 7 
                7 f f 1 8 1 9 9 8 1 8 8 1 f 7 7 
                7 f 9 1 8 9 1 1 8 8 9 9 8 f f 7 
                7 f 9 8 8 9 1 8 8 9 1 1 9 8 f f 
                f f 1 9 8 8 9 1 8 8 8 8 9 1 1 f 
                f 9 8 8 9 8 8 9 1 8 9 8 8 9 1 f 
                f 9 9 8 8 9 8 1 8 1 8 8 9 8 1 f 
                f 1 9 9 8 8 8 1 9 8 9 8 1 1 8 f 
                f f 8 9 9 8 1 8 1 8 8 8 8 1 f f 
                7 f f 8 8 1 9 8 9 8 8 1 9 8 f 7 
                7 7 f 8 1 9 8 9 1 8 8 8 1 1 7 7 
                7 7 f f 8 8 9 1 8 1 8 1 8 f 7 7 
                7 7 7 f 8 1 1 9 8 9 9 1 f f 7 7 
                7 7 7 f f f 1 8 9 1 1 f f 7 7 7 
                `, SpriteKind.Door)
            tiles.placeOnTile(doorSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Left))
        }
        if (explosionRange < 5) {
            if (Math.percentChance(50)) {
                explosionRangeUpSprite = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                    . a d d d d d d d d d d d d a . 
                    . d d c c c 2 c c 2 c 2 2 2 d . 
                    . d c c c c 2 c c 2 c 2 . 2 d . 
                    . d c c c c 2 c c 2 c 2 2 2 d . 
                    . d c c c c 2 c c 2 c 2 c c d . 
                    . d c c c 5 5 2 2 c c 2 c c d . 
                    . d c c 5 2 2 5 c c c c c c d . 
                    . d c 5 2 3 3 2 5 c c c c c d . 
                    . d 5 2 3 1 1 3 2 5 c c c c d . 
                    . d 5 2 3 1 1 3 2 5 c c c c d . 
                    . d c 5 2 3 3 2 5 c c c c c d . 
                    . d c c 5 2 2 5 c c c c c c d . 
                    . d c c c 5 5 c c c c c c c d . 
                    . a d d d d d d d d d d d d a . 
                    . . . . . . . . . . . . . . . . 
                    `, SpriteKind.ExplosionRangeUp)
                tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Left))
            }
        }
    } else {
        if (!(sprite.tileKindAt(TileDirection.Left, sprites.dungeon.floorLight2))) {
            if (depth == 1) {
                explosionSprite = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . 5 5 5 5 5 5 5 5 5 5 5 5 5 
                    . . 5 5 5 5 5 2 2 2 2 2 2 2 2 2 
                    . 5 5 5 2 2 2 2 3 3 3 3 3 3 3 3 
                    5 5 5 2 2 3 3 3 3 3 3 3 3 3 3 3 
                    5 5 2 2 3 3 1 1 1 1 1 1 1 1 1 1 
                    5 2 2 3 3 1 1 1 1 1 1 1 1 1 1 1 
                    5 2 2 3 3 1 1 1 1 1 1 1 1 1 1 1 
                    5 5 2 2 3 3 1 1 1 1 1 1 1 1 1 1 
                    5 5 5 2 2 3 3 3 3 3 3 3 3 3 3 3 
                    . 5 5 5 2 2 2 2 3 3 3 3 3 3 3 3 
                    . . 5 5 5 5 5 2 2 2 2 2 2 2 2 2 
                    . . . 5 5 5 5 5 5 5 5 5 5 5 5 5 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `, SpriteKind.Explosion)
                explosionSprite.z = 1
                explosionSprite.lifespan = 3000
                tiles.placeOnTile(explosionSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Left))
            } else {
                explosionSprite = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
                    5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `, SpriteKind.Explosion)
                explosionSprite.z = 1
                tiles.placeOnTile(explosionSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Left))
                explosionSprite.lifespan = 3000
                bombExplodeLeft(explosionSprite, depth - 1)
            }
        }
    }
}
sprites.onOverlap(SpriteKind.Enemy, SpriteKind.Explosion, function (sprite, otherSprite) {
    sprite.destroy(effects.ashes, 500)
})
// handling left side explosion
function bombExplodeRight (sprite: Sprite, depth: number) {
    if (sprite.tileKindAt(TileDirection.Right, sprites.builtin.brick)) {
        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Right), myTiles.tile1)
        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Right), false)
        if (!(doorFound)) {
            if (Math.percentChance(100 / (tiles.getTilesByType(sprites.builtin.brick).length + 1))) {
                doorFound = true
                doorSprite = sprites.create(img`
                    7 7 7 7 7 9 9 8 9 1 1 7 7 7 7 7 
                    7 7 7 7 9 1 8 1 1 8 8 7 7 7 7 7 
                    7 7 7 9 8 8 1 9 8 9 9 1 7 7 7 7 
                    7 7 9 1 8 1 9 9 8 1 8 8 1 7 7 7 
                    7 7 9 1 8 9 1 1 8 8 9 9 8 7 7 7 
                    7 7 9 8 8 9 1 8 8 9 1 1 9 8 7 7 
                    7 7 1 9 8 8 9 1 8 8 8 8 9 1 1 7 
                    7 9 8 8 9 8 8 9 1 8 9 8 8 9 1 7 
                    7 9 9 8 8 9 8 1 8 1 8 8 9 8 1 7 
                    7 1 9 9 8 8 8 1 9 8 9 8 1 1 8 7 
                    7 7 8 9 9 8 1 8 1 8 8 8 8 1 7 7 
                    7 7 7 8 8 1 9 8 9 8 8 1 9 8 7 7 
                    7 7 7 7 1 9 8 9 1 8 8 8 1 1 7 7 
                    7 7 7 8 8 8 9 1 8 1 8 1 8 7 7 7 
                    7 7 7 7 8 1 1 9 8 9 9 1 7 7 7 7 
                    7 7 7 7 7 7 1 8 9 1 1 7 7 7 7 7 
                    `, SpriteKind.Door)
                tiles.placeOnTile(doorSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Right))
            }
        }
        if (explosionRange < 5) {
            if (Math.percentChance(50)) {
                explosionRangeUpSprite = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                    . a d d d d d d d d d d d d a . 
                    . d d c c c 2 c c 2 c 2 2 2 d . 
                    . d c c c c 2 c c 2 c 2 . 2 d . 
                    . d c c c c 2 c c 2 c 2 2 2 d . 
                    . d c c c c 2 c c 2 c 2 c c d . 
                    . d c c c 5 5 2 2 c c 2 c c d . 
                    . d c c 5 2 2 5 c c c c c c d . 
                    . d c 5 2 3 3 2 5 c c c c c d . 
                    . d 5 2 3 1 1 3 2 5 c c c c d . 
                    . d 5 2 3 1 1 3 2 5 c c c c d . 
                    . d c 5 2 3 3 2 5 c c c c c d . 
                    . d c c 5 2 2 5 c c c c c c d . 
                    . d c c c 5 5 c c c c c c c d . 
                    . a d d d d d d d d d d d d a . 
                    . . . . . . . . . . . . . . . . 
                    `, SpriteKind.ExplosionRangeUp)
                tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Right))
            }
        }
    } else {
        if (!(sprite.tileKindAt(TileDirection.Right, sprites.dungeon.floorLight2))) {
            if (depth == 1) {
                explosionSprite = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    5 5 5 5 5 5 5 5 5 5 5 5 5 . . . 
                    2 2 2 2 2 2 2 2 2 5 5 5 5 5 . . 
                    3 3 3 3 3 3 3 3 2 2 2 2 5 5 5 . 
                    3 3 3 3 3 3 3 3 3 3 3 2 2 5 5 5 
                    1 1 1 1 1 1 1 1 1 1 3 3 2 2 5 5 
                    1 1 1 1 1 1 1 1 1 1 1 3 3 2 2 5 
                    1 1 1 1 1 1 1 1 1 1 1 3 3 2 2 5 
                    1 1 1 1 1 1 1 1 1 1 3 3 2 2 5 5 
                    3 3 3 3 3 3 3 3 3 3 3 2 2 5 5 5 
                    3 3 3 3 3 3 3 3 2 2 2 2 5 5 5 . 
                    2 2 2 2 2 2 2 2 2 5 5 5 5 5 . . 
                    5 5 5 5 5 5 5 5 5 5 5 5 5 . . . 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `, SpriteKind.Explosion)
                explosionSprite.z = 1
                explosionSprite.lifespan = 3000
                tiles.placeOnTile(explosionSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Right))
            } else {
                explosionSprite = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
                    1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 3 
                    2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
                    5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 5 
                    . . . . . . . . . . . . . . . . 
                    . . . . . . . . . . . . . . . . 
                    `, SpriteKind.Explosion)
                explosionSprite.z = 1
                explosionSprite.lifespan = 3000
                tiles.placeOnTile(explosionSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Right))
                bombExplodeRight(explosionSprite, depth - 1)
            }
        }
    }
}
// handling left side explosion
function bombExplodeBottom (sprite: Sprite, depth: number) {
    if (sprite.tileKindAt(TileDirection.Bottom, sprites.builtin.brick)) {
        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Bottom), myTiles.tile1)
        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Bottom), false)
        if (!(doorFound)) {
            if (Math.percentChance(100 / (tiles.getTilesByType(sprites.builtin.brick).length + 1))) {
                doorFound = true
                doorSprite = sprites.create(img`
                    7 7 7 7 7 9 9 8 9 1 1 7 7 7 7 7 
                    7 7 7 7 9 1 8 1 1 8 8 7 7 7 7 7 
                    7 7 7 9 8 8 1 9 8 9 9 1 7 7 7 7 
                    7 7 9 1 8 1 9 9 8 1 8 8 1 7 7 7 
                    7 7 9 1 8 9 1 1 8 8 9 9 8 7 7 7 
                    7 7 9 8 8 9 1 8 8 9 1 1 9 8 7 7 
                    7 7 1 9 8 8 9 1 8 8 8 8 9 1 1 7 
                    7 9 8 8 9 8 8 9 1 8 9 8 8 9 1 7 
                    7 9 9 8 8 9 8 1 8 1 8 8 9 8 1 7 
                    7 1 9 9 8 8 8 1 9 8 9 8 1 1 8 7 
                    7 7 8 9 9 8 1 8 1 8 8 8 8 1 7 7 
                    7 7 7 8 8 1 9 8 9 8 8 1 9 8 7 7 
                    7 7 7 7 1 9 8 9 1 8 8 8 1 1 7 7 
                    7 7 7 8 8 8 9 1 8 1 8 1 8 7 7 7 
                    7 7 7 7 8 1 1 9 8 9 9 1 7 7 7 7 
                    7 7 7 7 7 7 1 8 9 1 1 7 7 7 7 7 
                    `, SpriteKind.Door)
                tiles.placeOnTile(doorSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Bottom))
            }
        }
        if (explosionRange < 5) {
            if (Math.percentChance(50)) {
                explosionRangeUpSprite = sprites.create(img`
                    . . . . . . . . . . . . . . . . 
                    . a d d d d d d d d d d d d a . 
                    . d d c c c 2 c c 2 c 2 2 2 d . 
                    . d c c c c 2 c c 2 c 2 . 2 d . 
                    . d c c c c 2 c c 2 c 2 2 2 d . 
                    . d c c c c 2 c c 2 c 2 c c d . 
                    . d c c c 5 5 2 2 c c 2 c c d . 
                    . d c c 5 2 2 5 c c c c c c d . 
                    . d c 5 2 3 3 2 5 c c c c c d . 
                    . d 5 2 3 1 1 3 2 5 c c c c d . 
                    . d 5 2 3 1 1 3 2 5 c c c c d . 
                    . d c 5 2 3 3 2 5 c c c c c d . 
                    . d c c 5 2 2 5 c c c c c c d . 
                    . d c c c 5 5 c c c c c c c d . 
                    . a d d d d d d d d d d d d a . 
                    . . . . . . . . . . . . . . . . 
                    `, SpriteKind.ExplosionRangeUp)
                tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Bottom))
            }
        }
    } else {
        if (!(sprite.tileKindAt(TileDirection.Bottom, sprites.dungeon.floorLight2))) {
            if (depth == 1) {
                explosionSprite = sprites.create(img`
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 2 3 1 1 1 1 3 2 2 5 . . 
                    . . 5 5 2 3 1 1 1 1 3 2 5 5 . . 
                    . . 5 5 2 3 3 1 1 3 3 2 5 5 . . 
                    . . 5 5 2 2 3 3 3 3 2 2 5 5 . . 
                    . . 5 5 5 2 2 3 3 2 2 5 5 5 . . 
                    . . . 5 5 5 2 2 2 2 5 5 5 . . . 
                    . . . . 5 5 5 2 2 5 5 5 . . . . 
                    . . . . . 5 5 5 5 5 5 . . . . . 
                    `, SpriteKind.Explosion)
                explosionSprite.z = 1
                explosionSprite.lifespan = 3000
                tiles.placeOnTile(explosionSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Bottom))
            } else {
                explosionSprite = sprites.create(img`
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    . . 5 2 3 3 1 1 1 1 3 3 2 5 . . 
                    `, SpriteKind.Explosion)
                explosionSprite.z = 1
                explosionSprite.lifespan = 3000
                tiles.placeOnTile(explosionSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Bottom))
                bombExplodeBottom(explosionSprite, depth - 1)
            }
        }
    }
}
let explosionRangeUpSprite: Sprite = null
let doorSprite: Sprite = null
let explosionSprite: Sprite = null
let bombSprite: Sprite = null
let enemySprite: Sprite = null
let bombermanSprite: Sprite = null
let explosionRange = 0
let doorFound = false
doorFound = false
explosionRange = 1
scene.setBackgroundColor(7)
tiles.setTilemap(tilemap`level`)
bombermanSprite = sprites.create(img`
    3 3 3 3 3 3 f f f f 3 3 3 3 3 3 
    3 3 3 3 f f f 2 2 f f f 3 3 3 3 
    3 3 3 f f f 2 2 2 2 f f f 3 3 3 
    3 3 f f f e e e e e e f f f 3 3 
    3 3 f f e 2 2 2 2 2 2 e e f 3 3 
    3 3 f e 2 f f f f f f 2 e f 3 3 
    3 3 f f f f e e e e f f f f 3 3 
    3 f f e f b f 4 4 f b f e f f 3 
    3 f e e 4 1 f d d f 1 4 e e f 3 
    3 3 f e e d d d d d d e e f 3 3 
    3 3 3 f e e 4 4 4 4 e e f 3 3 3 
    3 3 e 4 f 2 2 2 2 2 2 f 4 e 3 3 
    3 3 4 d f 2 2 2 2 2 2 f d 4 3 3 
    3 3 4 4 f 4 4 5 5 4 4 f 4 4 3 3 
    3 3 3 3 3 f f f f f f 3 3 3 3 3 
    3 3 3 3 3 f f 3 3 f f 3 3 3 3 3 
    `, SpriteKind.Player)
bombermanSprite.z = 10
tiles.placeOnTile(bombermanSprite, tiles.getTileLocation(1, 1))
bmhelper.moveSprite(bombermanSprite, 100, 100)
scene.cameraFollowSprite(bombermanSprite)
for (let value of tiles.getTilesByType(myTiles.tile1)) {
    if (Math.percentChance(30)) {
        tiles.setTileAt(value, sprites.builtin.brick)
        tiles.setWallAt(value, true)
    }
}
for (let index = 0; index < 4; index++) {
    enemySprite = sprites.create(img`
        ........................
        ........................
        ........................
        ........................
        ..........ffff..........
        ........ff1111ff........
        .......fb111111bf.......
        .......f11111111f.......
        ......fd11111111df......
        ......fd11111111df......
        ......fddd1111dddf......
        ......fbdbfddfbdbf......
        ......fcdcf11fcdcf......
        .......fb111111bf.......
        ......fffcdb1bdffff.....
        ....fc111cbfbfc111cf....
        ....f1b1b1ffff1b1b1f....
        ....fbfbffffffbfbfbf....
        .........ffffff.........
        ...........fff..........
        ........................
        ........................
        ........................
        ........................
        `, SpriteKind.Enemy)
    enemySprite.z = 9
    tiles.placeOnRandomTile(enemySprite, myTiles.tile1)
    bmhelper.randomlyMoveSprite(enemySprite, 50)
}
