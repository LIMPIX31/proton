import { Packet, PacketState } from '../../Packet'
import { varint } from '../../../alias'

export class UpdateViewPositionPacket extends Packet {

  static type: number = 0x49
  static state: PacketState = PacketState.Play

  chunkX: varint = 0
  chunkZ: varint = 0

  constructor() {
    super(UpdateViewPositionPacket.state, UpdateViewPositionPacket.type)
  }

  encode() {
    this.writeVarint(this.chunkX, this.chunkZ)
  }

  decode() {
    this.chunkX = this.readVarint()
    this.chunkZ = this.readVarint()
  }
}
