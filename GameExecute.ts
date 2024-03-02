import ivm from "isolated-vm";
import { Bullet, Config } from "./GameConfig";
import { nextRound, nextUser, SetGameEnv } from "./GameEnvSet";

async function executeInIsolate() {
  // 创建隔离环境
  const isolate = new ivm.Isolate();
  const context = await isolate.createContext();
  const global = context.global;
  // 为隔离环境提供公共函数与属性
  SetGameEnv(global);

  // 执行代码
  let code1 = `
    if (GetRound() % 2 == 1) {MoveUp()}
    else {MoveRight()}
  `;
  let code2 = `
    if (GetRound() % 3 === 1) {FireLeft() }
    else if (GetRound() % 3 === 2){FireUp()}
    else {  Log('fire left'); FireLeft()}
  `;

  let logCode = `
    Log('--- After Round: ', round ,"CurUser: " , curUser ,' ---')
    Log('Red: ' , MyX(), MyY())
    Log('Blue: ' , EnemyX(), EnemyY())
    Log('Bullets: ' ,bulletList.derefInto())
    Log('-------------------------')
    Log(' ')
    `;
  let step = 1;
  context.evalSync(
    `Log('Red: ' , MyX(), MyY()) ;Log('Blue: ' , EnemyX(), EnemyY())`
  );
  while (step <= 3) {
    try {
      context.evalSync(code1);
    } catch (e) {
      console.log("--Code1 Finish--");
    }
    nextUser(global);
    try {
      context.evalSync(code2);
    } catch (e) {
      console.log("--Code2 Finish--");
    }
    nextUser(global);
    // 子弹碰撞
    // 子弹删除

    let new_bulletList = global.getSync("bulletList").deref() as Array<Bullet>;
    new_bulletList = new_bulletList.filter((bullet: Bullet) =>
      posValid(bullet.x, bullet.y)
    );
    global.setSync("bulletList", new ivm.Reference(new_bulletList));
    // 信息交互

    context.evalSync(logCode);

    // 下一个回合
    step++;
    nextRound(global);
  }

  // 清理资源
  isolate.dispose();
}

function rangeValid(pos: number, minVal: number, maxVal: number) {
  return pos >= minVal && pos < maxVal;
}

function posValid(x: number, y: number): boolean {
  return (
    rangeValid(x, 0, Config.Map_Width) && rangeValid(y, 0, Config.Map_Width)
  );
}

executeInIsolate().catch(console.error);
