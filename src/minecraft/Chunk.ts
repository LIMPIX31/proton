import { LightState } from './LightState'
import { ChunkDataAndUpdateLightPacket } from '../packets/states/play/ChunkDataAndUpdateLightPacket'
import { CompactArray } from '../utils/CompactArray'
import { long } from '../alias'
import { BiomeState } from './BiomeState'
import { range } from '../utils/range'
import { BlockState } from './BlockState'
import { ChunkRelated } from './ChunkRelated'
import { Position } from './Position'

class BlockStateWithPosition extends ChunkRelated {
  constructor(position: Position, public state: BlockState = new BlockState(0)) {
    super(position.x, position.y, position.z)
  }
}

class BiomeWithPosition extends ChunkRelated {
  constructor(position: Position, public biome: BiomeState) {
    super(position.x, position.y, position.z)
  }
}

class LightWithPosition extends ChunkRelated {
  constructor(position: Position, public light: LightState) {
    super(position.x, position.y, position.z)
  }
}

// FIXME: !!! Partial implementation !!!
export class Chunk {
  private static readonly CHUNK_SIZE = 16

  private blocks: BlockStateWithPosition[] = []
  private lights: LightWithPosition[] = []
  private biomes: BiomeWithPosition[] = []

  private readonly bitsPerHeightMapEntry: number

  constructor(public readonly chunkX: number, public readonly chunkZ: number, public readonly height: number = 24) {
    this.bitsPerHeightMapEntry = Math.ceil(Math.log2(height * 16 - 1))
  }

  get packet() {
    const chunk = new ChunkDataAndUpdateLightPacket()
    chunk.chunkX = this.chunkX
    chunk.chunkZ = this.chunkZ
    chunk.chunkSections = this.height
    const motionBlocking: long[] = []
    const hmapEntries = Chunk.CHUNK_SIZE ** 2
    for (let i = 0; i < hmapEntries; i++) {
      const currentLong = Math.floor((i * this.bitsPerHeightMapEntry) / 64)
      const topBlock = this.topBlock(Math.floor(i / 16), i % 16)
      if (!motionBlocking[currentLong]) motionBlocking[currentLong] = 0n
      if (topBlock !== 0) {
        motionBlocking[currentLong] <<= BigInt(this.bitsPerHeightMapEntry)
        motionBlocking[currentLong] |= BigInt(topBlock) << 1n
      }
    }
    chunk.heightmaps.MOTION_BLOCKING = motionBlocking
    chunk.heightmaps.WORLD_SURFACE = motionBlocking

    for (const section of range(this.height)) {

      const blocksInSection = this.nonAirBlockCountInSection(section)
      const hasBlocks = this.hasSectionBlocks(section)
      const singleBiome = this.isSingleBiomeSection(section)

      const orderedBlocks: BlockState[] = []
      const orderedBiomes: BiomeState[] = []

      for (const [x, y, z, n] of Chunk.sectionIterator()) {
        const yat = section * Chunk.CHUNK_SIZE + y
        const pos = new Position(x, yat, z)
        if (hasBlocks) orderedBlocks[n] = this.getBlockAt(pos)
        if (!singleBiome) orderedBiomes[n] = this.getBiomeAt(pos)
      }

      if (hasBlocks) {
        const palette: number[] = []
        const entries: number[] = []
        for (const block of orderedBlocks) {
          if (!palette.includes(block.rawState)) palette.push(block.rawState)
          entries.push(palette.indexOf(block.rawState))
        }
        let bitsPerBlock = Math.ceil(Math.log2(palette.length))
        bitsPerBlock < 4 && (bitsPerBlock = 4)
        const compact = new CompactArray(bitsPerBlock)
        for (const i of range(orderedBlocks.length))
          compact.set(i, BigInt(entries[i]))
        chunk.payload[section].blockCount = blocksInSection
        chunk.payload[section].blockStates = {
          bitsPerEntry: bitsPerBlock,
          palette: {
            palette
          },
          dataArray: compact.longs
        }
      }
      if (!singleBiome) {
        const palette: number[] = []
        const entries: number[] = []
        for (const biome of orderedBiomes) {
          if (!palette.includes(biome.type)) palette.push(biome.type)
          entries.push(palette.indexOf(biome.type))
        }
        let bitsPerBiome = Math.ceil(Math.log2(palette.length))
        // bitsPerBlock < 4 && (bitsPerBlock = 4)
        const compact = new CompactArray(bitsPerBiome)
        for (const i of range(orderedBlocks.length))
          compact.set(i, BigInt(entries[i]))
        chunk.payload[section].biomes = {
          bitsPerEntry: bitsPerBiome,
          palette: {
            palette
          },
          dataArray: compact.longs
        }
      } else {
        chunk.payload[section].biomes = {
          bitsPerEntry: 0,
          palette: {
            value: this.getBiomesInSection(section)[0] ?? 0
          },
          dataArray: []
        }
      }
    }
    return chunk
  }

  topBlock(x: number, z: number): number {
    return this.blocks.filter(v => v.x === x && v.z === z).sort((a, b) => b.y - a.y)?.[0]?.y ?? 0
  }

  setBlock(position: Position, block: BlockState) {
    const replaceCandidate = this.blocks.find(v => v.samePosition(position))
    if (replaceCandidate) {
      replaceCandidate.state.copy(block)
      return
    }
    this.blocks.push(new BlockStateWithPosition(position, block))
  }

  private getBlocksInSection(section: number) {
    return this.blocks.filter(v => v.y >= section * Chunk.CHUNK_SIZE && v.y < section * Chunk.CHUNK_SIZE + Chunk.CHUNK_SIZE)
  }

  private getBiomesInSection(section: number) {
    return this.biomes.filter(v => v.y >= section * Chunk.CHUNK_SIZE && v.y < section * Chunk.CHUNK_SIZE + Chunk.CHUNK_SIZE)
  }

  getBlockAt(position: Position): BlockState {
    return this.blocks.find(v => v.x === position.x && v.y === position.y && v.z === position.z)?.state ?? new BlockState(0)
  }

  private hasSectionBlocks(section: number) {
    return this.nonAirBlockCountInSection(section) !== 0
  }

  private nonAirBlockCountInSection(section: number) {
    return this.getBlocksInSection(section).filter(v => v.state.rawState !== 0).length
  }

  setBiome(position: Position, biome: BiomeState) {
    const replaceCandidate = this.biomes.find(v => v.samePosition(position))
    if (replaceCandidate) {
      replaceCandidate.biome.copy(biome)
      return
    }
    this.biomes.push(new BiomeWithPosition(position, biome))
  }

  getBiomeAt(position: Position): BiomeState {
    return this.biomes.find(v => v.x === position.x && v.y === position.y && v.z === position.z)?.biome ?? new BiomeState(0)
  }

  isSingleBiomeSection(section: number) {
    return new Set(this.getBiomesInSection(section).map(v => v.biome.type)).size <= 1
  }

  static* sectionIterator(): Generator<[x: number, y: number, z: number, n: number]> {
    for (let y = 0; y < Chunk.CHUNK_SIZE; y++)
      for (let x = 0; x < Chunk.CHUNK_SIZE; x++)
        for (let z = 0; z < Chunk.CHUNK_SIZE; z++)
          yield [x, y, z, (((y * Chunk.CHUNK_SIZE) + z) * Chunk.CHUNK_SIZE) + x]
  }
}
