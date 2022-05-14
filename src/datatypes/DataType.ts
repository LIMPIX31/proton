export type DataSchema = DataTypeConstructor | DataType<any>

export abstract class DataType<T> {
  abstract read(data: Buffer): [result: T, offset: number]
  abstract write(value: T): Buffer
}

export interface DataTypeConstructor {
  new(...args: any[]): DataType<any>
}

export const isDTC = (c: DataSchema): boolean => {
  return c instanceof DataType || new c() instanceof DataType
}
