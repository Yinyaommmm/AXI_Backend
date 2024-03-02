export const Config = {
  Map_Width: 16,
  Max_Step: 256,
  User_Speed: 1,
  Bullet_Speed: 3,
  Player1: "red",
  Player2: "blue",
};

export enum Color {
  empty,
  red,
  blue,
}
export enum BlockObj {
  none,
  red,
  blue,
  redBullet,
  blueBullet,
}
export enum BulletDirection {
  None,
  Up,
  Down,
  Left,
  Right,
}

export enum User {
  red,
  blue,
  None,
}

export class MapBlock {
  color = Color.empty;
  blockObj = BlockObj.none;
  bd = BulletDirection.None;

  setColor(c: Color) {
    this.color = c;
    return this;
  }
  setBlockObj(bo: BlockObj) {
    this.blockObj = bo;
    return this;
  }
  setBd(d: BulletDirection) {
    this.bd = d;
    return this;
  }
}

export function createGameMap() {
  const gmap: MapBlock[][] = new Array(Config.Map_Width).fill(0).map(() => {
    return new Array(Config.Map_Width).fill(new MapBlock());
  });
  gmap[0][0].setColor(Color.red).setBlockObj(BlockObj.red);
  gmap[Config.Map_Width - 1][Config.Map_Width - 1]
    .setColor(Color.blue)
    .setBlockObj(BlockObj.blue);
  return gmap;
}

export class Bullet {
  constructor(
    public x: number = -1,
    public y: number = -1,
    public from: User = User.None,
    public direction: BulletDirection = BulletDirection.None
  ) {}
  move() {
    switch (this.direction) {
      case BulletDirection.Down:
        this.y -= Config.Bullet_Speed;
        break;
      case BulletDirection.Up:
        this.y += Config.Bullet_Speed;
        break;
      case BulletDirection.Left:
        this.x -= Config.Bullet_Speed;
        break;
      case BulletDirection.Right:
        this.x += Config.Bullet_Speed;
        break;
    }
  }
}

export function calcDirection(dir: "X" | "Y", speed: number) {
  if (dir === "X") {
    return speed > 0 ? BulletDirection.Right : BulletDirection.Left;
  } else if (dir === "Y") {
    return speed > 0 ? BulletDirection.Up : BulletDirection.Down;
  }
  return BulletDirection.None;
}
