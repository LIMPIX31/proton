import { DataType } from './DataType'

export class UByte extends DataType<number> {
  read(data: Buffer): [result: number, offset: number] {
    return [data.slice(0, 1).readUint8(), 1]
  }

  write(value: number): Buffer {
    const bytebuf = Buffer.alloc(1)
    bytebuf.writeUint8(value)
    return bytebuf
  }

}
