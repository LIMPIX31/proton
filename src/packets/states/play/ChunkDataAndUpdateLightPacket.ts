import { Packet, PacketState, PacketType } from '../../Packet'
import { int, varint } from '../../../alias'
import {
  ChunkBlockEntity,
  ChunkBlocksPayload,
  ChunkSection,
  Heightmaps,
  LightArrays,
  superflatHeightmaps
} from '../../types/ChunkData'
import { BuildNBT } from '../../../nbt'
import { HeightmapsNBTModel } from '../../nbt-models/HeightmapsNBTModel'
import { ProtocolBuffer } from '../../../ProtocolBuffer'
import { BitSet } from '../../../utils/BitSet'

export class ChunkDataAndUpdateLightPacket extends Packet {
  static type: number = PacketType.ChunkData
  static state: number = PacketState.Play

  chunkSections: number = 24

  chunkX: int = 0
  chunkZ: int = 0
  heightmaps: Heightmaps = superflatHeightmaps
  size?: varint
  payload: ChunkBlocksPayload = new Array(this.chunkSections).fill(null).map(v => ({
    blockCount: 0,
    blockStates: {
      bitsPerEntry: 0,
      palette: {
        value: 0,
      },
      dataArray: []
    },
    biomes: {
      bitsPerEntry: 0,
      palette: {
        value: 0
      },
      dataArray: []
    }
  }))
  blockEntitiesCount?: varint
  blockEntities: ChunkBlockEntity[] = []
  trustEdges: boolean = true
  skyLightMask: BitSet = new BitSet()
  blockLightMask: BitSet = new BitSet()
  emptySkyLightMask: BitSet = new BitSet()
  emptyBlockLightMask: BitSet = new BitSet()
  skyLightArraysCount?: varint
  skyLightArrays: LightArrays[] = []
  blockLightArraysCount?: varint
  blockLightArrays: LightArrays[] = []

  constructor() {
    super(
      ChunkDataAndUpdateLightPacket.type,
      ChunkDataAndUpdateLightPacket.state
    )
  }

  encode() {
    this.writeInt(this.chunkX, this.chunkZ).writeNBT(
      BuildNBT(this.heightmaps, HeightmapsNBTModel),
      'root'
    )
    const blockPayload = new ProtocolBuffer()
    this.payload.forEach(v => {
      blockPayload.writeShort(v.blockCount)
      // Blocks
      blockPayload.writePalettedContainer(v.blockStates)
      // Biomes
      blockPayload.writePalettedContainer(v.biomes)
    })
    this.writeVarint(blockPayload.length)
      .writeBuffer(blockPayload.buffer)
      .writeVarint(this.blockEntitiesCount ?? this.blockEntities.length)
    this.blockEntities.forEach(v =>
      this.writePackedXZ(v.x, v.z)
        .writeShort(v.y)
        .writeVarint(v.type)
        .writeNBT(v.data)
    )
    this.writeBoolean(this.trustEdges)
      .writeBitSet(
        this.skyLightMask,
        this.blockLightMask,
        this.emptySkyLightMask,
        this.emptyBlockLightMask
      )
      .writeVarint(this.skyLightArraysCount ?? this.skyLightArrays.length)
    this.skyLightArrays.map(v =>
      this.writeVarint(v.length ?? v.array.length).writeByte(...v.array)
    )
    this.writeVarint(this.blockLightArraysCount ?? this.blockLightArrays.length)
    this.blockLightArrays.map(v =>
      this.writeVarint(v.length ?? v.array.length).writeByte(...v.array)
    )
  }

  decode(): void {
    this.chunkX = this.readInt()
    this.chunkZ = this.readInt()
    this.heightmaps = this.readNBT()
    this.size = this.readVarint()
    if (this.size > 0) {
      const rawPayload = this.readProtocolBuffer(this.size)
      this.payload = []
      for (let i = 0; i < this.chunkSections; i++) {
        const blockCount = rawPayload.readShort()
        const blockStates = rawPayload.readPalettedContainer()
        const biomes = rawPayload.readPalettedContainer()
        this.payload.push({
          blockCount,
          blockStates,
          biomes
        })
      }
    }
    this.blockEntitiesCount = this.readVarint()
    this.blockEntities = []
    for (let i = 0; i < this.blockEntitiesCount; i++) {
      const [x, z] = this.readPackedXZ()
      const y = this.readShort()
      const type = this.readVarint()
      const data = this.readNBT()
      this.blockEntities.push({
        x,
        y,
        z,
        data,
        type
      })
    }
    this.trustEdges = this.readBoolean()
    this.skyLightMask = this.readBitSet()
    this.blockLightMask = this.readBitSet()
    this.emptySkyLightMask = this.readBitSet()
    this.emptyBlockLightMask = this.readBitSet()
    this.skyLightArraysCount = this.readVarint()
    this.skyLightArrays = []
    for (let i = 0; i < this.skyLightArraysCount; i++) {
      const length = this.readVarint()
      const array = this.readByteArray(length)
      this.skyLightArrays.push({
        length,
        array
      })
    }
    this.blockLightArraysCount = this.readVarint()
    this.blockLightArrays = []
    for (let i = 0; i < this.blockLightArraysCount; i++) {
      const length = this.readVarint()
      const array = this.readByteArray(length)
      this.blockLightArrays.push({
        length,
        array
      })
    }
  }
}
