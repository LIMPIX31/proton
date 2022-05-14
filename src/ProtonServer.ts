import { TypedEmitter } from 'tiny-typed-emitter'
import { Packet, PacketConstructor, PacketState } from './packets/Packet'
import { createServer, Server } from 'net'

type SendPacket = (packet: Packet) => void
type SetState = (state: PacketState) => void

interface ProtonServerEvents {
  packet: (packet: Packet, send: SendPacket, setState: SetState) => void
}

export class ProtonServer extends TypedEmitter<ProtonServerEvents> {
  private server: Server
  private state: PacketState = PacketState.Handshaking

  constructor() {
    super()
    this.server = createServer(socket => {
      const sendPacket = (packet: Packet) => {
        packet.encode()
        socket.write(packet.data)
      }
      socket.on('data', data => {
        Packet.ejectPackets(data).forEach(packet =>
          this.emit('packet', packet, sendPacket, state => (this.state = state))
        )
      })
    })
  }

  listen(port: number = 25565, host?: string) {
    this.server.listen(port, host)
  }

  // TODO: Убрать дубликацию
  onPacket<T extends Packet>(
    TypedPacket: PacketConstructor<T>,
    listener: (packet: T, send: SendPacket, setState: SetState) => void
  ) {
    this.on('packet', (packet, send, setState) => {
      if (TypedPacket.state !== this.state || packet.type !== TypedPacket.type)
        return
      const typedPacket = new TypedPacket()
      typedPacket.setPacketData(packet.data)
      try {
        typedPacket.decode()
        listener(typedPacket, send, setState)
      } catch (e) {}
    })
  }

  oncePacket<T extends Packet>(
    TypedPacket: PacketConstructor<T>,
    listener: (packet: T, send: SendPacket, setState: SetState) => void
  ) {
    this.once('packet', (packet, send, setState) => {
      if (TypedPacket.state !== this.state || packet.type !== TypedPacket.type)
        return
      const typedPacket = new TypedPacket()
      typedPacket.setPacketData(packet.data)
      try {
        typedPacket.decode()
        listener(typedPacket, send, setState)
      } catch (e) {}
    })
  }
}
