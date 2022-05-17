import { int } from '../../../alias'
import { Packet, PacketState } from '../../Packet'

export class UnloadChunkPacket extends Packet {

  static type: number = 0x1D
  static state: number = PacketState.Play

  x: int = 0
  z: int = 0

  constructor() {
    super(UnloadChunkPacket.state, UnloadChunkPacket.type)
  }

  encode(): void {
    this.writeInt(this.x, this.z)
  }

  decode(): void {
    this.x = this.readInt()
    this.z = this.readInt()
  }

}
