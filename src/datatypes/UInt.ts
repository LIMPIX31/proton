import { DataType } from './DataType'

export class UInt extends DataType<number> {
  read(data: Buffer): [result: number, offset: number] {
    return [data.slice(0, 4).readUInt32BE(), 4]
  }

  write(value: number): Buffer {
    const intbuf = Buffer.alloc(4)
    intbuf.writeUInt32BE(value)
    return intbuf
  }
}
