import { Varint } from '../datatypes/Varint'
import { varint } from '../alias'
import { ProtocolBuffer } from '../ProtocolBuffer'

// export enum PacketType {
//   Handshake = <any>0,
//   LoginStart = <any>0,
//   EncriptionRequest = <any>1,
//   LoginSuccess = <any>2,
//   JoinGame = <any>38,
//   KeepAliveServer = <any>16,
//   KeepAliveClient = <any>33,
//   PlayerPositionAndLookClient = <any>56,
//   PlayDisconnect = <any>26,
//   UnloadChunk = <any>29,
//   ClientSettings = <any>5,
//   ChunkData = <any>34,
//   UpdateViewPosition = <any>73,
//   Unknown = <any>-1,
// }

export enum PacketState {
  Handshaking = 0,
  Status = 1,
  Login = 2,
  Play = 3,
}

export interface PacketConstructor<T extends Packet> {
  new (type?: number): T
  type: number
  state: PacketState
}

export class Packet extends ProtocolBuffer {
  static type: number = -1
  static state: PacketState = PacketState.Handshaking
  private _length: varint = 1

  constructor(public state: number, public type: number) {
    super()
  }

  encode() {}

  decode() {}

  static ejectPackets(data: Buffer, packets: Packet[] = []): [Packet[], Buffer] {
    try {
      while (data.length > 0) {
        const [packet, offset] = Packet.from(data)
        data = data.slice(offset)
        packets.push(packet)
      }
    } catch (e) {}
    return [packets, data]
  }

  static from(data: Buffer): [Packet, number] {
    const [length, o1] = new Varint().read(data)
    const [type, o2] = new Varint().read(data.slice(o1))
    const packet = new Packet(-1, type)
    packet.buffer = data.slice(o1 + o2, length - 1 + o1 + o2)
    if (packet.buffer.length !== length - 1)
      throw new Error('Invalid packet length')
    return [packet, length + o1]
  }

  setPacketData(data: Buffer) {
    const [length, o1] = new Varint().read(data)
    const [type, o2] = new Varint().read(data.slice(o1))
    this.type = type
    this._length = length
    this.buffer = data.slice(o1 + o2, length - 1 + o1 + o2)
  }

  get length(): varint {
    return this._length
  }

  get data(): Buffer {
    return Buffer.concat([
      new Varint().write(this.buffer.length + 1),
      new Varint().write(this.type),
      this.buffer,
    ])
  }
}

export * from './states/handshaking/packets'
export * from './states/login/packets'
export * from './states/play/packets'
