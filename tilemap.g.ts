// Auto-generated code. Do not edit.
namespace myTiles {
    //% fixedInstance jres blockIdentity=images._tile
    export const transparency16 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile1 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile2 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile3 = image.ofBuffer(hex``);
    //% fixedInstance jres blockIdentity=images._tile
    export const tile4 = image.ofBuffer(hex``);

    helpers._registerFactory("tilemap", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "level":
            case "level":return tiles.createTilemap(hex`13000f00030303030303030303030303030303030303030302020101010101010101010101010101010303020301030103010301030103010301030103030101010101010101010101010101010101030301030103010301030103010301030103010303010101010101010101010101010101010103030103010301030103010301030103010301030301010101010101010101010101010101010303010301030103010301030103010301030103030101010101010101010101010101010101030301030103010301030103010301030103010303010101010101010101010101010101010103030103010301030103010301030103010301030301010101010101010101010101010101010303030303030303030303030303030303030303`, img`
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
`, [myTiles.transparency16,myTiles.tile1,myTiles.tile2,myTiles.tile4], TileScale.Sixteen);
        }
        return null;
    })

    helpers._registerFactory("tile", function(name: string) {
        switch(helpers.stringTrim(name)) {
            case "transparency16":return transparency16;
            case "tile1":return tile1;
            case "tile2":return tile2;
            case "brickWall":
            case "tile3":return tile3;
            case "solidWall":
            case "tile4":return tile4;
        }
        return null;
    })

}
// Auto-generated code. Do not edit.
