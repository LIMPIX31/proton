import { long } from "../../../alias";
import { Packet, PacketState } from "../../Packet";

export class KeepAliveClientPacket extends Packet {

  static type: number = 0x21
  static state: number = PacketState.Play

  id: long = 0n

  constructor() {
    super(KeepAliveClientPacket.state, KeepAliveClientPacket.type)
  }

  decode(): void {
    this.id = this.readLong()
  }

  encode(): void {
    this.writeLong(this.id)
  }

}
