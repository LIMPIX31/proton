import { long } from '../alias'

export const prettyBinaryNumber = (long: long, radix: number = 64, recordSize: number = 8) => {
  const binary = long.toString(2).padStart(radix, '0').split('')
  return binary.map((v, i) => (i + 1) % recordSize === 0 ? `${v} `: v).join('')
}
