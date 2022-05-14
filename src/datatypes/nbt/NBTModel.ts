import { Byte, Float, Int, Short, Tag } from 'nbt-ts'

export type NBTModel<T> = { [P in keyof T]: NBTModel<T[P]> | any }

export const BuildNBT = <T>(obj: T, model: NBTModel<T>): Tag & T => {
  const nbt: Record<any, any> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'number' || typeof value === 'string') {
      if (model[key as keyof NBTModel<T>] as any instanceof Function) {
        nbt[key] = new model[key as keyof NBTModel<T>](value)
      } else {
        nbt[key] = value
      }
    } else if (typeof value === 'boolean') {
      nbt[key] = new model[key as keyof NBTModel<T>](+value)
    } else if (Array.isArray(value)) {
      nbt[key] = value.map(v => typeof v === 'object' ? BuildNBT(v, model[key as keyof NBTModel<T>][0]) : v)
    } else {
      nbt[key] = BuildNBT(value, model[key as keyof NBTModel<T>])
    }
  }
  return nbt
}

export const TagToPlain = <T extends object>(tag: Tag): T => {
  const newObj: any = {}
  Object.entries(tag).map(([key, value]) => {
    if(
         value instanceof Byte
      || value instanceof Short
      || value instanceof Float
      || value instanceof Int
    ) newObj[key] = value.value
    else if(typeof value === 'object') newObj[key] = TagToPlain(value)
    else newObj[key] = value
  })
  return newObj
}