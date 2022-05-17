export function range(max: number): Generator<number>
export function range(min: number, max: number): Generator<number>
export function range(min: number, max: number, step: number): Generator<number>
export function* range(
  min: number,
  max?: number,
  step: number = 1
): Generator<number> {
  for (let i = max ? min : 0; i < (max ?? min); i += step) yield i
}

export function* rangedItems<T>(items: T[]): Generator<[number, T]> {
  for (let i = 0; i < items.length; i++) yield [i, items[i]]
}
