// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);

    helpers.registerTilemapFactory(function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level": return tiles.createTilemap(hex`13000f00010101010101010101010101010101010101010103030202020202020202020202020202020101030102010201020102010201020102010201010202020202020202020202020202020202010102010201020102010201020102010201020101020202020202020202020202020202020201010201020102010201020102010201020102010102020202020202020202020202020202020101020102010201020102010201020102010201010202020202020202020202020202020202010102010201020102010201020102010201020101020202020202020202020202020202020201010201020102010201020102010201020102010102020202020202020202020202020202020101010101010101010101010101010101010101`, img`
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
2 . . . . . . . . . . . . . . . . . 2 
2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 
2 . . . . . . . . . . . . . . . . . 2 
2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 
2 . . . . . . . . . . . . . . . . . 2 
2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 
2 . . . . . . . . . . . . . . . . . 2 
2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 
2 . . . . . . . . . . . . . . . . . 2 
2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 
2 . . . . . . . . . . . . . . . . . 2 
2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 . 2 
2 . . . . . . . . . . . . . . . . . 2 
2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 2 
`, [myTiles.transparency16,sprites.dungeon.floorLight2,myTiles.tile1,myTiles.tile2], TileScale.Sixteen)
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
