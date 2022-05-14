import { NBTModel } from '../../datatypes/nbt/NBTModel'
import { NBTByte, NBTDouble, NBTFloat, NBTIdentifier, NBTInt, NBTString } from '../../datatypes/nbt/NBTTypes'
import { BiomeType } from '../types/DimensionRelated'

export const BiomeNBTModel: NBTModel<BiomeType> = {
  precipitation: NBTString,
  depth: NBTFloat,
  temperature: NBTFloat,
  scale: NBTFloat,
  downfall: NBTFloat,
  category: NBTString,
  temperature_modifier: NBTString,
  effects: {
    sky_color: NBTInt,
    water_fog_color: NBTInt,
    fog_color: NBTInt,
    water_color: NBTInt,
    foliage_color: NBTInt,
    grass_color: NBTInt,
    grass_color_modifier: NBTString,
    music: {
      replace_current_music: NBTByte,
      sound: NBTString,
      max_delay: NBTInt,
      min_delay: NBTInt
    },
    ambient_sound: NBTIdentifier,
    additions_sound: {
      sound: NBTIdentifier,
      tick_chance: NBTDouble
    },
    mood_sound: {
      sound: NBTIdentifier,
      tick_delay: NBTInt,
      offset: NBTDouble,
      block_search_extent: NBTInt
    },
    particle: {
      probability: NBTFloat,
      options: {
        type: NBTIdentifier
      }
    }
  }
}
