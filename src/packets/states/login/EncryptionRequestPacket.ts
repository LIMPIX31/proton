import { varint } from '../../../alias'
import { Packet, PacketState, PacketType } from '../../Packet'

export class EncryptionRequestPacket extends Packet {

  static type: number = PacketType.EncriptionRequest
  static state: number = PacketState.Login

  serverId: string = ''
  pubKeyLength?: varint
  pubKey: Buffer = Buffer.alloc(0)
  verifyTokenLength?: varint
  verifyToken: Buffer = Buffer.alloc(0)

  constructor() {
    super(EncryptionRequestPacket.type, EncryptionRequestPacket.state)
  }

  encode(): void {
    this
      .writeString(this.serverId)
      .writeVarint(this.pubKeyLength ?? this.pubKey.length)
      .writeBuffer(this.pubKey)
      .writeVarint(this.verifyTokenLength ?? this.verifyToken.length)
      .writeBuffer(this.verifyToken)
  }

  decode(): void {
    this.serverId = this.readString()
    this.pubKeyLength = this.readVarint()
    this.pubKey = this.readBuffer(this.pubKeyLength)
    this.verifyTokenLength = this.readVarint()
    this.verifyToken = this.readBuffer(this.verifyTokenLength)
  }
}
