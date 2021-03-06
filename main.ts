namespace SpriteKind {
    export const Bomb = SpriteKind.create()
    export const Explosion = SpriteKind.create()
    export const Door = SpriteKind.create()
    export const ExplosionRangeUp = SpriteKind.create()
    export const ExplosionControl = SpriteKind.create()
    export const MoreBombs = SpriteKind.create()
}
controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (explosionUnderControl) {
        for (let value of sprites.allOfKind(SpriteKind.Bomb)) {
            value.destroy()
        }
    }
})
function placeBomb () {
    if (bombNumbers > 0) {
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
        bombNumbers += -1
    }
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
    bombNumbers += 1
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Explosion, function (sprite, otherSprite) {
    game.over(false)
})
function bombExplodeTop (sprite: Sprite, depth: number) {
    if (sprite.tileKindAt(TileDirection.Top, assets.tile`brickWall`)) {
        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Top), assets.tile`tile1`)
        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Top), false)
        if (Math.percentChance(100 / (tiles.getTilesByType(assets.tile`brickWall`).length + 1))) {
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
            if (Math.percentChance(30)) {
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
            } else {
                if (Math.percentChance(30) && !(explosionUnderControl)) {
                    explosionRangeUpSprite = sprites.create(img`
                        . . . . . . . . . . . . . . . . 
                        . a d d d d d d d d d d d d a . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a b d d d d d d d a a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d d d d d c a d . 
                        . d a a a c c c c c c c c a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . a d d d d d d d d d d d d a . 
                        . . . . . . . . . . . . . . . . 
                        `, SpriteKind.ExplosionControl)
                    tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Top))
                } else {
                    if (Math.percentChance(30)) {
                        explosionRangeUpSprite = sprites.create(img`
                            . . . . . . . . . . . . . . . . 
                            . a d d d d d d d d d d d d a . 
                            . d a a a a a a a a a a a a d . 
                            . d a a a a a a a 5 a a a a d . 
                            . d a a a a f f 2 a a a a a d . 
                            . d a a a f f 2 f f a a a a d . 
                            . d a a f f f 2 1 f f a a a d . 
                            . d a a f f f e f 1 f c a a d . 
                            . d a a f d f f f f f c a a d . 
                            . d a a a f d f f f c c a a d . 
                            . d a a a a f f f c c a a a d . 
                            . d a a a a a c c c a a a a d . 
                            . d a a a a a a a a a a a a d . 
                            . d a a a a a a a a a a a a d . 
                            . a d d d d d d d d d d d d a . 
                            . . . . . . . . . . . . . . . . 
                            `, SpriteKind.MoreBombs)
                        tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Top))
                    }
                }
            }
        }
    } else {
        if (!(sprite.tileKindAt(TileDirection.Top, assets.tile`solidWall`))) {
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
    if (sprite.tileKindAt(TileDirection.Left, assets.tile`brickWall`)) {
        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Left), assets.tile`tile1`)
        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Left), false)
        if (Math.percentChance(100 / (tiles.getTilesByType(assets.tile`brickWall`).length + 1))) {
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
            if (Math.percentChance(30)) {
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
            } else {
                if (Math.percentChance(30) && !(explosionUnderControl)) {
                    explosionRangeUpSprite = sprites.create(img`
                        . . . . . . . . . . . . . . . . 
                        . a d d d d d d d d d d d d a . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a b d d d d d d d a a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d d d d d c a d . 
                        . d a a a c c c c c c c c a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . a d d d d d d d d d d d d a . 
                        . . . . . . . . . . . . . . . . 
                        `, SpriteKind.ExplosionControl)
                    tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Left))
                } else {
                    if (Math.percentChance(30)) {
                        explosionRangeUpSprite = sprites.create(img`
                            . . . . . . . . . . . . . . . . 
                            . a d d d d d d d d d d d d a . 
                            . d a a a a a a a a a a a a d . 
                            . d a a a a a a a 5 a a a a d . 
                            . d a a a a f f 2 a a a a a d . 
                            . d a a a f f 2 f f a a a a d . 
                            . d a a f f f 2 1 f f a a a d . 
                            . d a a f f f e f 1 f c a a d . 
                            . d a a f d f f f f f c a a d . 
                            . d a a a f d f f f c c a a d . 
                            . d a a a a f f f c c a a a d . 
                            . d a a a a a c c c a a a a d . 
                            . d a a a a a a a a a a a a d . 
                            . d a a a a a a a a a a a a d . 
                            . a d d d d d d d d d d d d a . 
                            . . . . . . . . . . . . . . . . 
                            `, SpriteKind.MoreBombs)
                        tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Left))
                    }
                }
            }
        }
    } else {
        if (!(sprite.tileKindAt(TileDirection.Left, assets.tile`solidWall`))) {
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
    if (sprite.tileKindAt(TileDirection.Right, assets.tile`brickWall`)) {
        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Right), assets.tile`tile1`)
        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Right), false)
        if (!(doorFound)) {
            if (Math.percentChance(100 / (tiles.getTilesByType(assets.tile`brickWall`).length + 1))) {
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
            if (Math.percentChance(30)) {
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
            } else {
                if (Math.percentChance(30) && !(explosionUnderControl)) {
                    explosionRangeUpSprite = sprites.create(img`
                        . . . . . . . . . . . . . . . . 
                        . a d d d d d d d d d d d d a . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a b d d d d d d d a a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d d d d d c a d . 
                        . d a a a c c c c c c c c a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . a d d d d d d d d d d d d a . 
                        . . . . . . . . . . . . . . . . 
                        `, SpriteKind.ExplosionControl)
                    tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Right))
                } else {
                    if (Math.percentChance(30)) {
                        explosionRangeUpSprite = sprites.create(img`
                            . . . . . . . . . . . . . . . . 
                            . a d d d d d d d d d d d d a . 
                            . d a a a a a a a a a a a a d . 
                            . d a a a a a a a 5 a a a a d . 
                            . d a a a a f f 2 a a a a a d . 
                            . d a a a f f 2 f f a a a a d . 
                            . d a a f f f 2 1 f f a a a d . 
                            . d a a f f f e f 1 f c a a d . 
                            . d a a f d f f f f f c a a d . 
                            . d a a a f d f f f c c a a d . 
                            . d a a a a f f f c c a a a d . 
                            . d a a a a a c c c a a a a d . 
                            . d a a a a a a a a a a a a d . 
                            . d a a a a a a a a a a a a d . 
                            . a d d d d d d d d d d d d a . 
                            . . . . . . . . . . . . . . . . 
                            `, SpriteKind.MoreBombs)
                        tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Right))
                    }
                }
            }
        }
    } else {
        if (!(sprite.tileKindAt(TileDirection.Right, assets.tile`solidWall`))) {
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
sprites.onOverlap(SpriteKind.Player, SpriteKind.MoreBombs, function (sprite, otherSprite) {
    otherSprite.destroy(effects.ashes, 500)
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    bombNumbers += 1
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.ExplosionControl, function (sprite, otherSprite) {
    otherSprite.destroy(effects.ashes, 500)
    otherSprite.setFlag(SpriteFlag.Ghost, true)
    explosionUnderControl = true
})
// handling left side explosion
function bombExplodeBottom (sprite: Sprite, depth: number) {
    if (sprite.tileKindAt(TileDirection.Bottom, assets.tile`brickWall`)) {
        tiles.setTileAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Bottom), assets.tile`tile1`)
        tiles.setWallAt(tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Bottom), false)
        if (!(doorFound)) {
            if (Math.percentChance(100 / (tiles.getTilesByType(assets.tile`brickWall`).length + 1))) {
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
            if (Math.percentChance(30)) {
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
            } else {
                if (Math.percentChance(30) && !(explosionUnderControl)) {
                    explosionRangeUpSprite = sprites.create(img`
                        . . . . . . . . . . . . . . . . 
                        . a d d d d d d d d d d d d a . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a b d d d d d d d a a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d b b b d c a d . 
                        . d a a d d d d d d d d c a d . 
                        . d a a a c c c c c c c c a d . 
                        . d a a a a a a a a a a a a d . 
                        . d a a a a a a a a a a a a d . 
                        . a d d d d d d d d d d d d a . 
                        . . . . . . . . . . . . . . . . 
                        `, SpriteKind.ExplosionControl)
                    tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Bottom))
                } else {
                    if (Math.percentChance(30)) {
                        explosionRangeUpSprite = sprites.create(img`
                            . . . . . . . . . . . . . . . . 
                            . a d d d d d d d d d d d d a . 
                            . d a a a a a a a a a a a a d . 
                            . d a a a a a a a 5 a a a a d . 
                            . d a a a a f f 2 a a a a a d . 
                            . d a a a f f 2 f f a a a a d . 
                            . d a a f f f 2 1 f f a a a d . 
                            . d a a f f f e f 1 f c a a d . 
                            . d a a f d f f f f f c a a d . 
                            . d a a a f d f f f c c a a d . 
                            . d a a a a f f f c c a a a d . 
                            . d a a a a a c c c a a a a d . 
                            . d a a a a a a a a a a a a d . 
                            . d a a a a a a a a a a a a d . 
                            . a d d d d d d d d d d d d a . 
                            . . . . . . . . . . . . . . . . 
                            `, SpriteKind.MoreBombs)
                        tiles.placeOnTile(explosionRangeUpSprite, tiles.locationInDirection(tiles.locationOfSprite(sprite), CollisionDirection.Bottom))
                    }
                }
            }
        }
    } else {
        if (!(sprite.tileKindAt(TileDirection.Bottom, assets.tile`solidWall`))) {
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
let bombNumbers = 0
let explosionRange = 0
let explosionUnderControl = false
let doorFound = false
doorFound = false
explosionUnderControl = false
explosionRange = 1
bombNumbers = 1
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
for (let value of tiles.getTilesByType(assets.tile`tile1`)) {
    if (Math.percentChance(30)) {
        tiles.setTileAt(value, assets.tile`brickWall`)
        tiles.setWallAt(value, true)
    }
}
for (let index = 0; index < 4; index++) {
    enemySprite = sprites.create(assets.image`organeEnemy`, SpriteKind.Enemy)
    enemySprite.z = 9
    tiles.placeOnRandomTile(enemySprite, assets.tile`tile1`)
    bmhelper.randomlyMoveSprite(enemySprite, 50)
}
