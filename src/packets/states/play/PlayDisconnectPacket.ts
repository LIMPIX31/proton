import { Packet, PacketState, PacketType } from '../../Packet'
import { JSONChatComponent } from '../../types/JSONChatComponent'

export class PlayDisconnectPacket extends Packet {

  static type: number = PacketType.PlayDisconnect
  static state: number = PacketState.Play

  reason: JSONChatComponent = {
    text: 'Disconnected',
  }

  constructor() {
    super(PlayDisconnectPacket.type, PlayDisconnectPacket.state)
  }

  decode(): void {
    this.reason = this.readJSONChatComponent()
  }

  encode(): void {
    this.writeJSONChatComponent(this.reason)
  }
}
