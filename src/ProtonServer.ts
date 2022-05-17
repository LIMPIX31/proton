import { TypedEmitter } from 'tiny-typed-emitter'
import { KeepAliveClientPacket, Packet, PacketConstructor, PacketState } from './packets/Packet'
import { AddressInfo, createServer, Server } from 'net'

type SendPacket = (packet: Packet) => void
type SetState = (state: PacketState) => void

interface ProtonServerEvents {
  packet: (packet: Packet, send: SendPacket, setState: SetState, currentState: PacketState) => void
}

interface Connection {
  id: string
  state: PacketState
  keepAliveThread: NodeJS.Timer
  packetBuffer?: Buffer
}

export class ProtonServer extends TypedEmitter<ProtonServerEvents> {
  private server: Server
  private connections: Connection[] = []
  constructor() {
    super()
    this.server = createServer(socket => {
      const host = (socket.address() as AddressInfo).address
      const port = socket.remotePort
      console.log(
        `Initiated connection from ${host}:${port}`
      )

      const sendPacket = (packet: Packet) => {
        packet.encode()
        socket.write(packet.data)
      }

      const connection: Connection = {
        id: `${host}:${port}`,
        state: PacketState.Handshaking,
        keepAliveThread: setInterval(() => {
          sendPacket(new KeepAliveClientPacket())
        },10000),
        packetBuffer: Buffer.alloc(0)
      }
      this.connections.push(connection)

      socket.on('data', data => {
        connection.packetBuffer = Buffer.concat([connection.packetBuffer ?? Buffer.alloc(0), data])
        const currentConnection = this.connections.find(v => v.id === connection.id)
        const [packets, lest] = Packet.ejectPackets(data)
        connection.packetBuffer = lest
        packets.forEach(packet =>
          this.emit('packet', packet, sendPacket, state => currentConnection && (currentConnection.state = state), connection.state)
        )
      })

      socket.on('close', () => {
        this.connections = this.connections.filter(v => v !== connection)
        clearInterval(connection.keepAliveThread)
        delete connection.packetBuffer
        console.log(`Disconnected from ${host}:${port}`)
      })
    })
  }

  listen(port: number = 25565, host?: string) {
    this.server.listen(port, host)
  }

  // TODO: Убрать дубликацию
  onPacket<T extends Packet>(
    TypedPacket: PacketConstructor<T>,
    listener: (packet: T, send: SendPacket, setState: SetState, state: PacketState) => void
  ) {
    this.on('packet', (packet, send, setState, state) => {
      if (TypedPacket.state !== state || packet.type !== TypedPacket.type)
        return
      const typedPacket = new TypedPacket()
      typedPacket.setPacketData(packet.data)
      try {
        typedPacket.decode()
        listener(typedPacket, send, setState, state)
      } catch (e) {}
    })
  }

  oncePacket<T extends Packet>(
    TypedPacket: PacketConstructor<T>,
    listener: (packet: T, send: SendPacket, setState: SetState, state: PacketState) => void
  ) {
    this.once('packet', (packet, send, setState, state) => {
      if (TypedPacket.state !== state || packet.type !== TypedPacket.type)
        return
      const typedPacket = new TypedPacket()
      typedPacket.setPacketData(packet.data)
      try {
        typedPacket.decode()
        listener(typedPacket, send, setState, state)
      } catch (e) {}
    })
  }
}
