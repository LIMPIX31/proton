import { NBTModel } from '../../datatypes/nbt/NBTModel'
import { NBTByte, NBTDouble, NBTFloat, NBTIdentifier, NBTInt, NBTLong } from '../../datatypes/nbt/NBTTypes'
import { DimensionType } from '../types/DimensionRelated'

export const DimensionNBTModel: NBTModel<DimensionType> = {
  piglin_safe: NBTByte,
  natural: NBTByte,
  ambient_light: NBTFloat,
  fixed_time: NBTLong,
  infiniburn: NBTIdentifier,
  respawn_anchor_works: NBTByte,
  has_skylight: NBTByte,
  bed_works: NBTByte,
  effects: NBTIdentifier,
  has_raids: NBTByte,
  min_y: NBTInt,
  height: NBTInt,
  logical_height: NBTInt,
  coordinate_scale: NBTDouble,
  ultrawarm: NBTByte,
  has_ceiling: NBTByte
}
