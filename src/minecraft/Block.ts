import { ChunkRelated } from './ChunkRelated'
import { DataClass } from '../utils/DataClass'
import _ from 'lodash'
import { BlockState } from './BlockState'

export class Block<NBT = undefined> extends ChunkRelated implements DataClass<Block<NBT>> {
  private _state: BlockState = new BlockState('minecraft:air')
  _nbt?: NBT

  constructor(state: BlockState)
  constructor(x: number, y: number, z: number, state: BlockState)
  constructor(x: number, y: number, z: number, state: BlockState, nbt: NBT)

  constructor(x: BlockState | number, y?: number, z?: number, state?: BlockState, nbt?: NBT) {
    if(x instanceof BlockState) {
      super(0,0,0)
      this._state = x
    }
    else super(x, y ?? 0, z ?? 0)
    if (state) this._state = state
    if (nbt) this._nbt = nbt
  }

  get isBlockEntity(): boolean {
    return !!this._nbt
  }

  set state(value: BlockState) {
    this._state = value
  }

  get state() {
    return this._state
  }

  set nbt(nbt: NBT | undefined) {
    this._nbt = nbt
  }

  get nbt() {
    return this._nbt
  }

  equals(obj: Block<NBT>): boolean {
    return obj.x === this.x && obj.y === this.y && obj.z === this.z && obj.state.equals(this.state) && _.isEqual(obj.nbt, this.nbt)
  }

  copy(block: Block) {
    this.x = block.x
    this.y = block.z
    this.z = block.z
    this.state.copy(block.state)
    this.nbt = block.nbt
  }
}
