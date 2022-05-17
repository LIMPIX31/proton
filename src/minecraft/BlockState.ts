import {
  BlockId,
  blocksStates,
  BlockStateProperties,
  BlockStatesTypeWithBlockId,
  BlockStateType, TypedBlockStateProperties
} from '../reports/reports'
import { DataClass } from '../utils/DataClass'

export class BlockState implements DataClass<BlockState>{

  constructor(blockId: BlockId)

  constructor(stateId: number)

  constructor(stateId: number | BlockId) {
    if (typeof stateId === 'string'){
      this.state = BlockState.getDefaultStateByBlockId(stateId).id
      this._blockId = stateId
    }
    else this.state = stateId
  }

  static getStatesByBlockId(id: BlockId): BlockStateType[] {
    return blocksStates[id].states
  }

  static getDefaultStateByBlockId(id: BlockId): BlockStateType {
    const result = BlockState.getStatesByBlockId(id).find(v => v.default === true)
    if (!result)
      throw new Error(`Could not find default state for ${id}`)
    return result
  }

  static findBlockByStateId(stateId: number): BlockStatesTypeWithBlockId {
    const result = Object.entries(blocksStates).find(([key, v]) => !!v.states.find(v => v.id === stateId))
    if (!result)
      throw new Error(`Could not find block by state id ${stateId}`)
    return {
      ...result[1],
      blockId: result[0] as BlockId
    }
  }

  static get TotalBlockStates(): number {
    return Object.values(blocksStates).map(v => v.states.length).reduce((a, b) => a + b)
  }

  private state: number = 0
  private _blockId: BlockId = 'minecraft:air'

  setBlockId(id: BlockId) {
    this.state = BlockState.getDefaultStateByBlockId(id).id
  }

  setRawState(stateId: number) {
    this.state = stateId
  }

  setState<T extends BlockId>(state: TypedBlockStateProperties<T>) {
    const states = BlockState.findBlockByStateId(this.state)
    const result = states.states.find(v => {
      let found = true
      for (const key of Object.keys(v.properties ?? {}))
        if ((state as any)[key] !== v.properties?.[key]) found = false
      return found
    })
    if (result) this.state = result.id
  }

  get rawState(): number {
    return this.state
  }

  get blockId(): BlockId {
    return BlockState.findBlockByStateId(this.state).blockId
  }

  equals(obj: BlockState): boolean {
    return this.state === obj.state
  }

  copy(state: BlockState) {
    this.state = state.state
  }

}
