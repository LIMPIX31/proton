import { long } from "../../../alias";
import { Packet, PacketState, PacketType } from "../../Packet";

export class KeepAliveClientPacket extends Packet {

  static type: number = PacketType.KeepAliveClient
  static state: number = PacketState.Play

  id: long = 0n

  constructor() {
    super(KeepAliveClientPacket.type, KeepAliveClientPacket.state)
  }

  decode(): void {
    this.id = this.readLong()
  }

  encode(): void {
    this.writeLong(this.id)
  }

}
