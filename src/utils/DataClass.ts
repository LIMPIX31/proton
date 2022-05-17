export interface DataClass<T> {
  hashCode?(): number

  equals(obj: T): boolean
}
