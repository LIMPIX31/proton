import { NBTModel } from '../../datatypes/nbt/NBTModel'
import { Heightmaps } from '../types/ChunkData'
import { NBTLong } from '../../datatypes/nbt/NBTTypes'

export const HeightmapsNBTModel: NBTModel<Heightmaps> = {
  MOTION_BLOCKING: [NBTLong],
  WORLD_SURFACE: [NBTLong]
}
