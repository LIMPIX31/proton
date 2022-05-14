import { Packet, PacketState, PacketType } from '../../Packet'

export class HandshakePacket extends Packet {
  static type: number = PacketType.Handshake
  static state: number = PacketState.Handshaking

  protocol: number = 0
  address: string = 'localhost'
  port: number = 25565
  nextState: PacketState = PacketState.Login

  constructor() {
    super(HandshakePacket.type, HandshakePacket.state)
  }

  decode(): void {
    this.protocol = this.readVarint()
    this.address = this.readString()
    this.port = this.readShort()
    this.nextState = this.readVarint()
  }

  encode(): void {
    this.writeVarint(this.protocol)
      .writeString(this.address)
      .writeShort(this.port)
      .writeVarint(this.nextState)
  }
}
