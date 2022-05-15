import { DataTypeConstructor, isDTC } from './datatypes/DataType'
import { byte, double, float, int, long, short, ubyte, uint, ulong, ushort, varint } from './alias'
import { Byte } from './datatypes/Byte'
import { UByte } from './datatypes/UByte'
import { Int } from './datatypes/Int'
import { UInt } from './datatypes/UInt'
import { Short } from './datatypes/Short'
import { UShort } from './datatypes/UShort'
import { ULong } from './datatypes/ULong'
import { Long } from './datatypes/Long'
import { Varint } from './datatypes/Varint'
import { Boolean } from './datatypes/Boolean'
import { Float } from './datatypes/Float'
import { Double } from './datatypes/Double'
import { String } from './datatypes/String'
import { decode, encode, Tag } from 'nbt-ts'
import { JSONChatComponent } from './packets/types/JSONChatComponent'
import { TagToPlain } from './datatypes/nbt/NBTModel'

export class ProtocolBuffer {
  private _data: Buffer = Buffer.alloc(0)

  get buffer() {
    return this._data
  }

  set buffer(buffer: Buffer) {
    this._data = buffer
  }

  get length() {
    return this._data.length
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

  writeBuffer(...value: (Buffer | Uint8Array)[]): this {
    this.write(...value)
    return this
  }

  writeByte(...value: byte[]): this {
    this.writeType(Byte, ...value)
    return this
  }

  writeUByte(...value: ubyte[]): this {
    this.writeType(UByte, ...value)
    return this
  }

  writeInt(...value: int[]): this {
    this.writeType(Int, ...value)
    return this
  }

  writeUInt(...value: uint[]): this {
    this.writeType(UInt, ...value)
    return this
  }

  writeShort(...value: short[]): this {
    this.writeType(Short, ...value)
    return this
  }

  writeUShort(...value: ushort[]): this {
    this.writeType(UShort, ...value)
    return this
  }

  writeULong(...value: ulong[]): this {
    this.writeType(ULong, ...value)
    return this
  }

  writeLong(...value: long[]): this {
    this.writeType(Long, ...value)
    return this
  }

  writeVarint(...value: varint[]): this {
    this.writeType(Varint, ...value)
    return this
  }

  writeBoolean(...value: boolean[]): this {
    this.writeType(Boolean, ...value)
    return this
  }

  writeFloat(...value: float[]): this {
    this.writeType(Float, ...value)
    return this
  }

  writeDouble(...value: double[]): this {
    this.writeType(Double, ...value)
    return this
  }

  writeString(...value: string[]): this {
    this.writeType(String, ...value)
    return this
  }

  writeUUID(...value: (Buffer | Uint8Array)[]): this {
    this.writeBuffer(...value.map(v => v.slice(0, 16)))
    return this
  }

  writeNBT(value: Tag, root?: string | null): this {
    this.writeBuffer(encode(root ?? null, value))
    return this
  }

  writeJSONChatComponent(component: JSONChatComponent): this {
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
