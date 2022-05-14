import { Packet, PacketState, PacketType } from "../../Packet"


export class LoginSuccessPacket extends Packet {

  static type: number = PacketType.LoginSuccess
  static state: number = PacketState.Login

  uuid: Uint8Array = new Uint8Array()
  username: string = 'Player'

  constructor() {
    super(LoginSuccessPacket.type, LoginSuccessPacket.state)
  }

  encode(): void {
    this
      .writeUUID(this.uuid)
      .writeString(this.username)
  }

  decode(): void {
    this.uuid = this.readUUID()
  }

}
