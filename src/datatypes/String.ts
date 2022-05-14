import { DataType } from './DataType'
import { Varint } from './Varint'

export class String extends DataType<string> {

  read(data: Buffer): [result: string, offset: number] {
    let [value, offset] = new Varint().read(data)
    const buf = data
      .slice(offset, offset + value)
    const decoded = buf.toString('utf8')
    return [decoded, offset + value]
  }

  write(value: string): Buffer {
    const strbuf = Buffer.from(value, 'utf8')
    return Buffer.concat([new Varint().write(strbuf.length), strbuf])
  }

}
