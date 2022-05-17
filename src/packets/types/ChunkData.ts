import { byte, long, short, ubyte, varint } from '../../alias'

export interface Heightmaps {
  MOTION_BLOCKING: long[]
  WORLD_SURFACE: long[]
}

export const superflatHeightmaps: Heightmaps = {
  MOTION_BLOCKING: [...new Array(36).fill(0x0100804020100804n), 0x0000000020100804n],
  WORLD_SURFACE: []
}

export type ChunkBlocksPayload = ChunkSection[]

export interface ChunkSection {
  blockCount: short
  blockStates: PalettedContainer
  biomes: PalettedContainer
}

export interface Palette {
}

export interface PalettedContainer {
  bitsPerEntry: ubyte
  palette?: SingleValuedPalette | IndirectPalette | DirectPalette
  dataArrayLength?: varint
  dataArray: long[]
}

export interface SingleValuedPalette extends Palette {
  value: varint
}

export interface IndirectPalette extends Palette {
  paletteLength?: varint
  palette: varint[]
}

export interface DirectPalette extends Palette {
}

export interface LightArrays {
  length?: varint
  array: byte[]
}

export interface ChunkBlockEntity<T extends object = any> {
  x: number
  y: number
  z: number
  type: varint
  data: T
}
