import blockStatesJson from './generated/blocks'

export const blocksStates: BlocksStatesType = blockStatesJson as any

export type BlockId = keyof typeof blockStatesJson
export type BlocksStatesType = Record<BlockId, BlockStatesType>

export type TypedBlockStateProperties<T extends BlockId> = typeof blockStatesJson[T] extends { properties: infer Props }
  ? { [P in keyof Props]: Props[P] extends readonly unknown[] ? Props[P][number] : never }
  : never

export type BlockStateProperties = Record<string, string>

export interface BlockStateType {
  properties?: BlockStateProperties
  id: number
  default?: boolean
}

export interface BlockStatesType {
  properties?: Record<string, string[]>
  states: BlockStateType[]
}

export interface BlockStatesTypeWithBlockId extends BlockStatesType {
  blockId: BlockId
}
