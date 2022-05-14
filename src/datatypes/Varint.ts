import { DataType } from './DataType'

export class Varint extends DataType<number> {

  private readonly SEGMENT_BITS = 0x7f
  private readonly CONTINUE_BIT = 0x80
  protected readonly maxLength: number = 32

  read(data: Buffer): [result: number, offset: number] {
    let result = 0
    let offset = 0
    let position = 0
    let currentByte: number

    while (true) {
      currentByte = data.readInt8(offset)
      offset++
      result |= (currentByte & this.SEGMENT_BITS) << position
      if ((currentByte & this.CONTINUE_BIT) === 0) break
      position += 7
      if (position >= this.maxLength)
        throw new Error('Varint is too big')
    }

    return [result, offset]
  }

  write(value: number): Buffer {
    let buf = Buffer.alloc(0)
    while (true) {
      if ((value & ~this.SEGMENT_BITS) == 0) {
        buf = Buffer.concat([buf, Buffer.from([value])])
        break
      }
      buf = Buffer.concat([
        buf,
        Buffer.from([(value & this.SEGMENT_BITS) | this.CONTINUE_BIT])
      ])
      value >>>= 7
    }
    return buf
  }

}
