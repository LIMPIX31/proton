import { Packet, PacketState } from '../../Packet'
import { JSONChatComponent } from '../../types/JSONChatComponent'

export class PlayDisconnectPacket extends Packet {

  static type: number = 0x1A
  static state: number = PacketState.Play

  reason: JSONChatComponent = {
    text: 'Disconnected',
  }

  constructor() {
    super(PlayDisconnectPacket.state, PlayDisconnectPacket.type)
  }

  decode(): void {
    this.reason = this.readJSONChatComponent()
  }

  encode(): void {
    this.writeJSONChatComponent(this.reason)
  }
}
