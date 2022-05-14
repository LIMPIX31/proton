import { Packet, PacketState, PacketType } from '../../Packet'

export class LoginStartPacket extends Packet {

  static type: number = PacketType.LoginStart
  static state: number = PacketState.Login

  username: string = 'Player'

  constructor() {
    super(LoginStartPacket.type, LoginStartPacket.state)
  }

  decode(): void {
    this.username = this.readString()
  }

  encode(): void {
    this.writeString(this.username)
  }
}
