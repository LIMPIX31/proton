import { DataType } from './DataType'

export class Boolean extends DataType<boolean> {
  read(data: Buffer): [result: boolean, offset: number] {
    return [!!data.slice(0, 1)[0], 1]
  }

  write(value: boolean): Buffer {
    return Buffer.from([+value])
  }

}
