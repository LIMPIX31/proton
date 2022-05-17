import { DataClass } from '../utils/DataClass'
import { double } from '../alias'

export class Position implements DataClass<Position> {
  constructor(public x: number = 0, public y: number = 0, public z: number = 0) {}

  equals(obj: Position): boolean {
    return this.x === obj.x && this.y === obj.y && this.z === obj.z
  }

  copy(position: Position){
    this.x = position.x
    this.y = position.y
    this.z = position.z
  }

  samePosition(pos: Position): boolean {
    return pos.x === this.x && pos.y === this.y && pos.z === this.z
  }
}
