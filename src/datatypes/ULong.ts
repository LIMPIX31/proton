import { DataType } from './DataType'

export class ULong extends DataType<bigint> {
  read(data: Buffer): [result: bigint, offset: number] {
    return [data.slice(0, 8).readBigUint64BE(), 8]
  }

  write(value: bigint): Buffer {
    const intbuf = Buffer.alloc(8)
    intbuf.writeBigUInt64BE(value)
    return intbuf
  }

}
