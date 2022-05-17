import { ChunkRelated } from './ChunkRelated'
import { DataClass } from '../utils/DataClass'

export class BiomeState implements DataClass<BiomeState> {
  private _id: number = 0

  constructor(id: number = 0) {
    this._id = id
  }

  get type() {
    return this._id
  }

  set type(type: number) {
    this._id = type
  }

  copy(biome: BiomeState){
    this._id = biome._id
  }

  equals(obj: BiomeState): boolean {
    return this._id === obj._id
  }
}
