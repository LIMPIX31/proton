import { NBTModel } from '../../datatypes/nbt/NBTModel'
import { DimensionCodec } from '../types/DimensionRelated'
import { NBTInt, NBTString } from '../../datatypes/nbt/NBTTypes'
import { DimensionNBTModel } from './DimensionNBTModel'
import { BiomeNBTModel } from './BiomeNBTModel'

export const DimensionCodecNBTModel: NBTModel<DimensionCodec> = {
  'minecraft:dimension_type': {
    type: NBTString,
    value: [{
      name: NBTString,
      id: NBTInt,
      element: DimensionNBTModel
    }]
  },
  'minecraft:worldgen/biome': {
    type: NBTString,
    value: [{
      name: NBTString,
      id: NBTInt,
      element: BiomeNBTModel
    }]
  }
}
