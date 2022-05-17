import { Packet, PacketState } from '../../Packet'

export class LoginStartPacket extends Packet {

  static type: number = 0x00
  static state: number = PacketState.Login

  username: string = 'Player'

  constructor() {
    super(LoginStartPacket.state, LoginStartPacket.type)
  }

  decode(): void {
    this.username = this.readString()
  }

  encode(): void {
    this.writeString(this.username)
  }
}
