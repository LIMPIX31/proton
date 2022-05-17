import { long, uint } from '../alias'

export class CompactArray {

  private data: long[] = []
  private readonly mask: long

  constructor(private bitsPerEntry: number) {
    this.mask = (1n << BigInt(bitsPerEntry)) - 1n
  }

  set(at: number, value: long) {
    const startLong = Math.floor((at * this.bitsPerEntry) / 64)
    const startOffset = Math.floor((at * this.bitsPerEntry) % 64)
    const endLong = Math.floor(((at + 1) * this.bitsPerEntry - 1) / 64)
    value &= this.mask
    if(!this.data[startLong]) this.data[startLong] = 0n
    this.data[startLong] |= (value << BigInt(startOffset))
    if (startLong != endLong)
      this.data[endLong] = (value >> (64n - BigInt(startOffset)))
  }

  get longs(): long[] {
    return this.data
  }

}
