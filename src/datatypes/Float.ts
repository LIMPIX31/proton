import { DataType } from './DataType'

export class Float extends DataType<number> {
  read(data: Buffer): [result: number, offset: number] {
    return [data.slice(0, 4).readFloatBE(), 4]
  }

  write(value: number): Buffer {
    const floatbuf = Buffer.alloc(4)
    floatbuf.writeFloatBE(value)
    return floatbuf
  }

}
