import { ULong } from './ULong'

export class Long extends ULong {
  read(data: Buffer): [result: bigint, offset: number] {
    return [data.slice(0, 8).readBigInt64BE(), 8]
  }

  write(value: bigint): Buffer {
    const intbuf = Buffer.alloc(8)
    intbuf.writeBigInt64BE(value)
    return intbuf
  }
}
