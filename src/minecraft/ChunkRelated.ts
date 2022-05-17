export abstract class ChunkRelated {

  private _x: number = 0
  private _y: number = 0
  private _z: number = 0

  protected constructor(x: number, y: number, z: number)

  protected constructor(x: number, z:number)

  protected constructor(x: number, yz: number, z?: number) {
    if(z !== undefined) {
      this._x = x
      this._y = yz
      this._z = z
    } else {
      this._x = x
      this._z = yz
    }
  }

  get x()  {
    return this._x
  }

  get y()  {
    return this._y
  }

  get z()  {
    return this._z
  }

  set x(value: number)  {
    this._x = value & 15
  }

  set y(value: number)  {
    this._y = value & 15
  }

  set z(value: number)  {
    this._z = value & 15
  }

  samePosition(pos: ChunkRelated): boolean {
    return pos.x === this.x && pos.y === this.y && pos.z === this.z
  }
}
