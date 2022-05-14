import { DataType } from './DataType'
import { UInt } from './UInt'

export class Int extends UInt {
  read(data: Buffer): [result: number, offset: number] {
    return [data.slice(0, 4).readInt32BE(), 4]
  }

  write(value: number): Buffer {
    const intbuf = Buffer.alloc(4)
    intbuf.writeInt32BE(value)
    return intbuf
  }

}
