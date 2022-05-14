import { UShort } from './UShort'

export class Short extends UShort {
  read(data: Buffer): [result: number, offset: number] {
    return [data.slice(0, 2).readInt16BE(), 2]
  }

  write(value: number): Buffer {
    const intbuf = Buffer.alloc(2)
    intbuf.writeInt16BE(value)
    return intbuf
  }
}
