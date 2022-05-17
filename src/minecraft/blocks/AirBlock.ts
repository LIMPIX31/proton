import { BlockState } from '../BlockState'
import { Block } from '../Block'

export class AirBlock extends Block {
  constructor(x: number, y: number, z: number) {
    super(x, y, z, new BlockState(0))
  }
}
