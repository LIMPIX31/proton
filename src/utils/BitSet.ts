import { long, varint } from "../alias";
import { ProtocolBuffer } from "../ProtocolBuffer";

export class BitSet {
  private _longs: long[] = []
  
  get longArray(): long[] {
    return this._longs
  }

  get length() {
    return this._longs.length
  }

  get data(){
    const buffer = new ProtocolBuffer()
    buffer.writeVarint(this.length).writeLong(...this._longs)
    return buffer.buffer
  }

  set(bitIndex: long, value: boolean = true) {
    const a = bitIndex % 64n
    const b = Math.floor(Number(bitIndex / 64n))
    if (this._longs[b] === undefined) this._longs[b] = BigInt(0)
    if (value) this._longs[b] |= 1n << a
    else this._longs[b] &= 0n << a
  }

  get(bitIndex: long): boolean {
    return !!(this._longs[Math.floor(Number(bitIndex / 64n))] & (1n << (bitIndex % 64n)))
  }

  clear(bitIndex: long){
    this.set(bitIndex, false)
  }

  flip(from: long, to: long) {
    const fromValue = this.get(from)
    const toValue = this.get(to)
    this.set(from, fromValue)
    this.set(to, toValue)
  }

  set longs(longs: long[]) {
    this._longs = longs
  }

}