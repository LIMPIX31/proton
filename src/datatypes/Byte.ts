import { UByte } from './UByte'

export class Byte extends UByte{
  read(data: Buffer): [result: number, offset: number] {
    return [data.slice(0, 1).readInt8(), 1]
  }

  write(value: number): Buffer {
    const bytebuf = Buffer.alloc(1)
    bytebuf.writeInt8(value)
    return bytebuf
  }
}
