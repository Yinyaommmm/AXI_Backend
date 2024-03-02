const ivm = require('isolated-vm');
const fs = require('fs');
const {Config,Color,BlockObj,BulletDirection}  = require('./GameConfig')



async function executeInIsolate() {
    // 准备游戏运行环境
    const gameMap = new Array(Config.Map_Width).fill(0).map(i => {
        return new Array (Config.Map_Width).fill({color: Color.empty, blockObj : BlockObj.none ,bd : BulletDirection.None})
    })
    gameMap[0][0] = {
        color: Color.red,
        blockObj: BlockObj.red
    }
    gameMap[Config.Map_Width - 1][Config.Map_Width - 1] = {
        color: Color.blue,
        blockObj: BlockObj.blueBullet
    }

    // 隔离箱
    const isolate = new ivm.Isolate();
    const context = await isolate.createContext();
    const global = context.global
    global.setSync('Log', function(...args) {
        console.log(...args);
    });


    const code = 'let a = 5;Log(a)'
    context.evalSync(code)


    // 清理资源
    isolate.dispose();
}

executeInIsolate().catch(console.error);
