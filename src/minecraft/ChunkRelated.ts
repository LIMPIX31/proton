import { Position } from './Position'

export abstract class ChunkRelated extends Position{
  protected constructor()

  protected constructor(x?: number, y?: number, z?: number)

  protected constructor(x?: number, z?:number)

  protected constructor(x?: number, yz?: number, z?: number) {
    if(z !== undefined) {
      super(x, yz, z)
    } else {
      super(x, 0, yz)
    }
  }
}
