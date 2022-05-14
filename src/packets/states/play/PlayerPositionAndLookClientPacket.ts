import { byte, double, float, varint } from '../../../alias'
import { Packet, PacketState, PacketType } from '../../Packet'

export class PlayerPositionAndLookClientPacket extends Packet {

  static type: number = PacketType.PlayerPositionAndLookClient
  static state: number = PacketState.Play

  x: double = 0
  y: double = 0
  z: double = 0
  yaw: float = 0
  pitch: float = 0
  flags: byte = 0
  teleportId: varint = 0
  dismount: boolean = false

  constructor() {
    super(PlayerPositionAndLookClientPacket.type, PlayerPositionAndLookClientPacket.state)
  }

  encode(): void {
    this
      .writeDouble(this.x, this.y, this.z)
      .writeFloat(this.yaw, this.pitch)
      .writeByte(this.flags)
      .writeVarint(this.teleportId)
      .writeBoolean(this.dismount)
  }

  decode(): void {
    this.x = this.readDouble()
    this.y = this.readDouble()
    this.z = this.readDouble()
    this.yaw = this.readFloat()
    this.pitch = this.readFloat()
    this.flags = this.readByte()
    this.teleportId = this.readVarint()
    this.dismount = this.readBoolean()
  }

}
