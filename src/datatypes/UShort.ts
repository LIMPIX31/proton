import { DataType } from './DataType'

export class UShort extends DataType<number> {
  read(data: Buffer): [result: number, offset: number] {
    return [data.slice(0, 2).readUInt16BE(), 2]
  }

  write(value: number): Buffer {
    const intbuf = Buffer.alloc(2)
    intbuf.writeUInt16BE(value)
    return intbuf
  }
}
