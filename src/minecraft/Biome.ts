import { ChunkRelated } from './ChunkRelated'
import { DataClass } from '../utils/DataClass'

export class Biome extends ChunkRelated implements DataClass<Biome> {
  private _id: number = 0

  constructor(x: number, y: number, z: number, id: number = 0) {
    super(x, y, z)
    this._id = id
  }

  get type() {
    return this._id
  }

  set type(type: number) {
    this._id = type
  }

  copy(biome: Biome){
    this._id = biome._id
  }

  equals(obj: Biome): boolean {
    return this._id === obj._id
  }
}
