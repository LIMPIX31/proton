import { parse, stringify, v4 } from 'uuid'

export const randomUUID = () => Buffer.from(parse(v4()) as Uint8Array)
export const UUIDToString = (uuid: Uint8Array) =>  stringify(uuid)
