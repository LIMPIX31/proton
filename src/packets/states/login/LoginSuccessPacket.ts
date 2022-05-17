import { Packet, PacketState } from "../../Packet"


export class LoginSuccessPacket extends Packet {

  static type: number = 0x02
  static state: number = PacketState.Login

  uuid: Uint8Array = new Uint8Array()
  username: string = 'Player'

  constructor() {
    super(LoginSuccessPacket.state, LoginSuccessPacket.type)
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
