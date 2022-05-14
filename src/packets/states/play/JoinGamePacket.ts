import { BuildNBT } from '../../../datatypes/nbt/NBTModel'
import { identifier, int, long, varint } from '../../../alias'
import { DimensionCodecNBTModel } from '../../nbt-models/DimensionCodecNBTModel'
import { DimensionNBTModel } from '../../nbt-models/DimensionNBTModel'
import { Packet, PacketState, PacketType } from '../../Packet'
import { DefaultDimension, defaultDimensionCodec, DimensionCodec, DimensionType } from '../../types/DimensionRelated'
import { Gamemode } from '../../types/Gamemode'
export class JoinGamePacket extends Packet {

  static type: number = PacketType.JoinGame
  static state: number = PacketState.Play

  entityId: int = 0
  isHardcore: boolean = false
  gamemode: Gamemode = Gamemode.Survival
  prevGamemode: Gamemode = -1
  dimensionsCount: varint = 3
  dimensions: identifier[] = ['minecraft:overworld', 'minecraft:the_nether', 'minecraft:the_end']
  dimensionCodec: DimensionCodec = defaultDimensionCodec
  currentDimension: DimensionType = DefaultDimension.OVERWORLD
  dimensionIdentifier: identifier = 'minecraft:overworld'
  hashedSeed: long = 0n
  maxPlayers: varint = 20
  viewDistance: varint = 8
  simulationDistance: varint = 8
  reducedDebugInfo: boolean = false
  enableRespawnScreen: boolean = true
  isDebug: boolean = false
  isFlat: boolean = false
  
  constructor() {
    super(JoinGamePacket.type, JoinGamePacket.state)
  }

  encode(): void {
    this
      .writeInt(this.entityId)
      .writeBoolean(this.isHardcore)
      .writeUByte(this.gamemode)
      .writeByte(this.prevGamemode)
      .writeVarint(this.dimensionsCount)
      .writeString(...this.dimensions)
      .writeNBT(BuildNBT(this.dimensionCodec, DimensionCodecNBTModel), 'root')
      .writeNBT(BuildNBT(this.currentDimension, DimensionNBTModel), 'root')
      .writeString(this.dimensionIdentifier)
      .writeLong(this.hashedSeed)
      .writeVarint(this.maxPlayers, this.viewDistance, this.simulationDistance)
      .writeBoolean(this.reducedDebugInfo, this.enableRespawnScreen, this.isDebug, this.isFlat)
  }

  decode(): void {
    this.entityId = this.readInt()
    this.isHardcore = this.readBoolean()
    this.gamemode = this.readUByte()
    this.prevGamemode = this.readByte()
    this.dimensionsCount = this.readVarint()
    this.dimensions = this.readStringArray(this.dimensionsCount)
    this.dimensionCodec = this.readNBT<DimensionCodec>()
    this.currentDimension = this.readNBT<DimensionType>()
    this.dimensionIdentifier = this.readString()
    this.hashedSeed = this.readLong()
    this.maxPlayers = this.readVarint()
    this.viewDistance = this.readVarint()
    this.simulationDistance = this.readVarint()
    this.reducedDebugInfo = this.readBoolean()
    this.enableRespawnScreen = this.readBoolean()
    this.isDebug = this.readBoolean()
    this.isFlat = this.readBoolean()
  }

}
