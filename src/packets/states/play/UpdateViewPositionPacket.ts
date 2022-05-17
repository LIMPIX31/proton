import { Packet, PacketState, PacketType } from '../../Packet'
import { varint } from '../../../alias'

export class UpdateViewPositionPacket extends Packet {

  static type: PacketType = PacketType.UpdateViewPosition
  static state: PacketState = PacketState.Play

  chunkX: varint = 0
  chunkZ: varint = 0

  constructor() {
    super(UpdateViewPositionPacket.type, UpdateViewPositionPacket.state)
  }

  encode() {
    this.writeVarint(this.chunkX, this.chunkZ)
  }

  decode() {
    this.chunkX = this.readVarint()
    this.chunkZ = this.readVarint()
  }
}
