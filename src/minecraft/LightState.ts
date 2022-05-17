export type LightType = 'sky' | 'block'

export class LightState {
  constructor(public type: LightType, public level: number = 15) {}
}
