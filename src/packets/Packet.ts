import { Varint } from '../datatypes/Varint'
import { Byte } from '../datatypes/Byte'
import { UInt } from '../datatypes/UInt'
import { Int } from '../datatypes/Int'
import { UByte } from '../datatypes/UByte'
import { Short } from '../datatypes/Short'
import { UShort } from '../datatypes/UShort'
import { ULong } from '../datatypes/ULong'
import { Long } from '../datatypes/Long'
import { Boolean } from '../datatypes/Boolean'
import {
  byte,
  double,
  float,
  int,
  long,
  short,
  ubyte,
  uint,
  ulong,
  ushort,
  varint,
} from '../alias'
import { Float } from '../datatypes/Float'
import { String } from '../datatypes/String'
import { decode, encode, Tag } from 'nbt-ts'
import { TagToPlain } from '../datatypes/nbt/NBTModel'
import {
  DataSchema,
  DataType,
  DataTypeConstructor,
  isDTC,
} from '../datatypes/DataType'
import { JSONChatComponent } from './types/JSONChatComponent'
import { Double } from '../datatypes/Double'

export enum PacketType {
  Handshake = <any>0,
  LoginStart = <any>0,
  EncriptionRequest = <any>1,
  LoginSuccess = <any>2,
  JoinGame = <any>38,
  KeepAliveServer = <any>16,
  KeepAliveClient = <any>33,
  PlayerPositionAndLookClient = <any>56,
  PlayDisconnect = <any>26,
  ClientSettings = <any>5,
  Unknown = <any>-1,
}

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

export class Packet {
  static type: number = -1
  static state: PacketState = PacketState.Handshaking

  private _data: Buffer = Buffer.alloc(0)
  private _length: varint = 1

  constructor(public type: number, public state: number) {}

  encode() {}
  decode() {}

  static ejectPackets(data: Buffer, packets: Packet[] = []): Packet[] {
    try {
      while (data.length > 0) {
        const [packet, offset] = Packet.from(data)
        data = data.slice(offset)
        packets.push(packet)
      }
    } catch (e) {}
    return packets
  }

  static from(data: Buffer): [Packet, number] {
    const [length, o1] = new Varint().read(data)
    const [type, o2] = new Varint().read(data.slice(o1))
    const packet = new Packet(type, -1)
    packet._data = data.slice(o1 + o2, length - 1 + o1 + o2)
    if (packet._data.length < length - 1)
      throw new Error('Invalid packet length')
    return [packet, length + o1]
  }

  setPacketData(data: Buffer) {
    const [length, o1] = new Varint().read(data)
    const [type, o2] = new Varint().read(data.slice(o1))
    this.type = type
    this._length = length
    this._data = data.slice(o1 + o2, length - 1 + o1 + o2)
  }

  get length(): varint {
    return this._length
  }

  get data(): Buffer {
    return Buffer.concat([
      new Varint().write(this._data.length + 1),
      new Varint().write(this.type),
      this._data,
    ])
  }

  private writeType<T>(dt: DataTypeConstructor, ...data: T[]) {
    if (!isDTC(dt))
      throw new Error(
        'Provided type must be instanced or extends from DataType'
      )
    this.write(Buffer.concat(data.map(v => new dt().write(v))))
  }

  private write(...data: Uint8Array[]) {
    this._data = Buffer.concat([this._data, ...data])
  }

  private readType<T>(dt: DataTypeConstructor): T {
    if (!isDTC(dt))
      throw new Error(
        'Provided type must be instanced or extends from DataType'
      )
    return this.read(new dt().read(this._data))
  }

  private readTypes<T>(dt: DataTypeConstructor, length: number): T[] {
    const result: T[] = []
    for (let i = 0; i < length; i++) result.push(this.readType<T>(dt))
    return result
  }

  private read<T>([result, offset]: [T, number]): T {
    this._data = this._data.slice(offset)
    return result
  }

  writeBuffer(...value: (Buffer | Uint8Array)[]): Packet {
    this.write(...value)
    return this
  }

  writeByte(...value: byte[]): Packet {
    this.writeType(Byte, ...value)
    return this
  }

  writeUByte(...value: ubyte[]): Packet {
    this.writeType(UByte, ...value)
    return this
  }

  writeInt(...value: int[]): Packet {
    this.writeType(Int, ...value)
    return this
  }

  writeUInt(...value: uint[]): Packet {
    this.writeType(UInt, ...value)
    return this
  }

  writeShort(...value: short[]): Packet {
    this.writeType(Short, ...value)
    return this
  }

  writeUShort(...value: ushort[]): Packet {
    this.writeType(UShort, ...value)
    return this
  }

  writeULong(...value: ulong[]): Packet {
    this.writeType(ULong, ...value)
    return this
  }

  writeLong(...value: long[]): Packet {
    this.writeType(Long, ...value)
    return this
  }

  writeVarint(...value: varint[]): Packet {
    this.writeType(Varint, ...value)
    return this
  }

  writeBoolean(...value: boolean[]): Packet {
    this.writeType(Boolean, ...value)
    return this
  }

  writeFloat(...value: float[]): Packet {
    this.writeType(Float, ...value)
    return this
  }

  writeDouble(...value: double[]): Packet {
    this.writeType(Double, ...value)
    return this
  }

  writeString(...value: string[]): Packet {
    this.writeType(String, ...value)
    return this
  }

  writeUUID(...value: (Buffer | Uint8Array)[]): Packet {
    this.writeBuffer(...value.map(v => v.slice(0, 16)))
    return this
  }

  writeNBT(value: Tag, root?: string | null): Packet {
    this.writeBuffer(encode(root ?? null, value))
    return this
  }

  writeJSONChatComponent(component: JSONChatComponent): Packet {
    this.writeString(JSON.stringify(component))
    return this
  }

  readBuffer(bufferLength: number): Buffer {
    return this.read([this._data.slice(bufferLength), bufferLength])
  }

  readByte(): byte {
    return this.readType(Byte)
  }

  readUByte(): ubyte {
    return this.readType(UByte)
  }

  readInt(): int {
    return this.readType(Int)
  }

  readUInt(): uint {
    return this.readType(UInt)
  }

  readShort(): short {
    return this.readType(Short)
  }

  readUShort(): ushort {
    return this.readType(UShort)
  }

  readULong(): ulong {
    return this.readType(ULong)
  }

  readLong(): long {
    return this.readType(Long)
  }

  readVarint(): varint {
    return this.readType(Varint)
  }

  readBoolean(): boolean {
    return this.readType(Boolean)
  }

  readFloat(): float {
    return this.readType(Float)
  }

  readDouble(): double {
    return this.readType(Double)
  }

  readString(): string {
    return this.readType(String)
  }

  readUUID(): Buffer {
    return this.readBuffer(16)
  }

  readNBT<T extends object>(unnamed?: boolean): T {
    const result = decode(this._data, { unnamed })
    return this.read([TagToPlain(result.value ?? {}), result.length]) as T
  }

  readJSONChatComponent(): JSONChatComponent {
    return JSON.parse(this.readString())
  }

  readByteArray(arrayLength: number): byte[] {
    return this.readTypes(Byte, arrayLength)
  }

  readUByteArray(arrayLength: number): ubyte[] {
    return this.readTypes(UByte, arrayLength)
  }

  readIntArray(arrayLength: number): int[] {
    return this.readTypes(Int, arrayLength)
  }

  readUIntArray(arrayLength: number): uint[] {
    return this.readTypes(UInt, arrayLength)
  }

  readShortArray(arrayLength: number): short[] {
    return this.readTypes(Short, arrayLength)
  }

  readUShortArray(arrayLength: number): ushort[] {
    return this.readTypes(UShort, arrayLength)
  }

  readULongArray(arrayLength: number): ulong[] {
    return this.readTypes(ULong, arrayLength)
  }

  readLongArray(arrayLength: number): long[] {
    return this.readTypes(Long, arrayLength)
  }

  readVarintArray(arrayLength: number): varint[] {
    return this.readTypes(Varint, arrayLength)
  }

  readBooleanArray(arrayLength: number): boolean[] {
    return this.readTypes(Boolean, arrayLength)
  }

  readFloatArray(arrayLength: number): float[] {
    return this.readTypes(Float, arrayLength)
  }

  readDoubleArray(arrayLength: number): double[] {
    return this.readTypes(Double, arrayLength)
  }

  readStringArray(arrayLength: number): string[] {
    return this.readTypes(String, arrayLength)
  }
}

export * from './states/handshaking/packets'
export * from './states/login/packets'
export * from './states/play/packets'
