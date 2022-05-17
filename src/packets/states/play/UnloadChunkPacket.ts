import { int } from '../../../alias'
import { Packet, PacketState, PacketType } from '../../Packet'

export class UnloadChunkPacket extends Packet {

  static type: number = PacketType.UnloadChunk
  static state: number = PacketState.Play

  x: int = 0
  z: int = 0

  constructor() {
    super(UnloadChunkPacket.type, UnloadChunkPacket.state)
  }

  encode(): void {
    this
      .writeInt(this.x, this.z)
  }

  decode(): void {
    this.x = this.readInt()
    this.z = this.readInt()
  }

}
