import { ChunkRelated } from './ChunkRelated'

export type LightType = 'sky' | 'block'

export class Light extends ChunkRelated {

  private _type: LightType = 'block'
  private _level: number = 15

  constructor(x: number, y: number, z: number, level?: number)

  constructor(type: LightType, x: number, y: number, z: number, level?: number)

  constructor(xt: number | LightType, yx: number, zy: number, lz: number, level?: number) {
    if(typeof xt === 'string'){
      super(yx, zy, lz)
      this._type = xt
    }else {
      super(xt, yx, lz)
    }
    this._level = level ?? lz
  }
}
