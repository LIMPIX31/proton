import { Packet, PacketState } from '../../Packet'
import { long } from '../../../alias'

export class TimeUpdatePacket extends Packet {
  static state: number = PacketState.Play
  static type: number = 0x59

  worldAge: long = 0n
  time: long = 6000n

  constructor() {
    super(TimeUpdatePacket.state, TimeUpdatePacket.type)
  }

  encode() {
    this.writeLong(this.worldAge, this.time)
  }

  decode() {
    this.worldAge = this.readLong()
    this.time = this.readLong()
  }
}
