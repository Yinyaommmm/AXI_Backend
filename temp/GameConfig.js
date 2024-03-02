 const Color = {
    empty: 0,
    red: 1,
    blue : 2,
}
 const BlockObj = {
    none : 0,
    red: 1,
    blue: 2,
    redBullet: 3,
    blueBullet: 4,
}

const Config = { Map_Width: 16, Max_Step: 256 }

const BulletDirection = {
    None: -1,
    Up: 0,
    Bottom: 1,
    Left: 2,
    Right: 3
}
 
class MapBlock {
    
}

module.exports = {
    Color,
    BlockObj,
    Config,
    BulletDirection
}