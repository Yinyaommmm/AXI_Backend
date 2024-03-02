import ivm from "isolated-vm";
import {
  Bullet,
  calcDirection,
  Config,
  createGameMap,
  MapBlock,
  User,
} from "./GameConfig";

export function SetGameEnv(global: ivm.Reference) {
  // 准备游戏运行环境
  const gameMap: MapBlock[][] = createGameMap();
  global.setSync("Log", function (...args: any[]) {
    console.log(...args);
  });
  // 全局参数
  const ref_gameMap = new ivm.Reference(gameMap);
  global.setSync("gameMap", ref_gameMap); // Reference使用时，本Isolate用deref，其它Isolate使用derefInto

  const ref_bulletList = new ivm.Reference(new Array<Bullet>());
  global.setSync("bulletList", ref_bulletList);

  // 工厂函数，创建位移
  function move(dir: "X" | "Y", speed: Number): Function {
    const cache = new Map<string, Function>();
    const key = dir + "speed";
    if (!cache.has(key)) {
      cache.set(key, function () {
        let user = global.getSync("curUser");
        let curPos = global.getSync(user + dir);
        // 对新位置进行clamp
        let newPos = Math.min(
          Math.max(curPos + speed, 0),
          Config.Map_Width - 1
        );
        global.setSync(user + dir, newPos);
      });
    }
    return cache.get(key) as Function;
  }

  function getPos(u: "My" | "Enemy", dir: "X" | "Y") {
    const cache = new Map<string, Function>();
    const key = u + dir;
    if (!cache.has(key)) {
      let curUser = global.getSync("curUser");
      let target: string;
      if (u === "My") {
        target = curUser;
      } else {
        target = curUser === Config.Player1 ? Config.Player2 : Config.Player2;
      }
      cache.set(key, function () {
        return global.getSync(target + dir);
      });
    }
    return cache.get(key) as Function;
  }

  function fire(dir: "X" | "Y", speed: number): Function {
    const cache = new Map<string, Function>();
    const key = dir + speed;
    if (!cache.has(key)) {
      cache.set(key, function () {
        let curUser = global.getSync("curUser");
        const bullet = new Bullet(
          global.getSync(curUser + "X"),
          global.getSync(curUser + "Y"),
          curUser === "red" ? User.red : User.blue,
          calcDirection(dir, speed)
        );
        // 子弹瞬间移动三格
        if (dir === "X") {
          bullet.x += speed;
        } else {
          bullet.y += speed;
        }
        global.getSync("bulletList").deref().push(bullet);
      });
    }
    return cache.get(key) as Function;
  }

  global.setSync("round", 1);
  global.setSync("blueX", Config.Map_Width - 1);
  global.setSync("blueY", Config.Map_Width - 1);
  global.setSync("redX", 0);
  global.setSync("redY", 0);
  global.setSync("curUser", "red");
  // 全局函数
  global.setSync("MyX", getPos("My", "X"));
  global.setSync("MyY", getPos("My", "Y"));
  global.setSync("EnemyX", getPos("Enemy", "X"));
  global.setSync("EnemyY", getPos("Enemy", "Y"));
  global.setSync("MoveUp", move("Y", Config.User_Speed));
  global.setSync("MoveDown", move("Y", -Config.User_Speed));
  global.setSync("MoveLeft", move("X", -Config.User_Speed));
  global.setSync("MoveRight", move("X", Config.User_Speed));
  global.setSync("FireUp", fire("Y", Config.Bullet_Speed));
  global.setSync("FireDown", fire("Y", -Config.Bullet_Speed));
  global.setSync("FireLeft", fire("X", -Config.Bullet_Speed));
  global.setSync("FireRight", fire("X", Config.Bullet_Speed));
  global.setSync("GetRound", () => global.getSync("round"));
}

export function nextUser(global: ivm.Reference) {
  if (global.getSync("curUser") === "red") {
    global.setSync("curUser", "blue");
  } else {
    global.setSync("curUser", "red");
  }
}
export function nextRound(global: ivm.Reference) {
  global.setSync("round", global.getSync("round") + 1);
}
