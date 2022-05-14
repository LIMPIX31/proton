import { DataType } from './DataType'

export class Double extends DataType<number> {
  read(data: Buffer): [result: number, offset: number] {
    return [data.slice(0, 8).readDoubleBE(), 8]
  }

  write(value: number): Buffer {
    const floatbuf = Buffer.alloc(8)
    floatbuf.writeDoubleBE(value)
    return floatbuf
  }
}
