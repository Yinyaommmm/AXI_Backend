import ivm from "isolated-vm";
import { SetGameEnv } from "./GameEnvSet";

async function executeInIsolate() {
  // 创建隔离环境
  const isolate = new ivm.Isolate();
  const context = await isolate.createContext();
  const global = context.global;
  // 为隔离环境提供公共函数与属性
  SetGameEnv(global);

  // 执行代码
  let code = `
    Log('Game Round: ', round)
    Log('My: ' , MyX(), MyY())
    Log('Enemy: ' , EnemyX(), EnemyY())
    FireUp()
    Log('Bullets: ' ,bulletList.derefInto())
    `;

  context.evalSync(code);

  // 清理资源
  isolate.dispose();
}

executeInIsolate().catch(console.error);
