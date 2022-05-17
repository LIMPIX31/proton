import { byte } from '../../../alias'
import { Packet, PacketState } from '../../Packet'
import { ChatMode } from '../../types/ChatMode'
import { DisplayedSkinParts } from '../../types/DisplayedSkinParts'
import { MainHand } from '../../types/MainHand'

export class ClientSettingsPacket extends Packet {

  static type: number = 0x05
  static state: number = PacketState.Play

  locale: string = 'en_US'
  viewDistance: byte = 8
  chatMode: ChatMode = ChatMode.ENABLED
  colorsEnabled: boolean = true
  displayedSkinParts: byte =
    DisplayedSkinParts.Jacket |
    DisplayedSkinParts.LeftSleeve |
    DisplayedSkinParts.RightSleeve |
    DisplayedSkinParts.LeftPantsLeg |
    DisplayedSkinParts.RightPantsLeg
  mainHand: MainHand = MainHand.RIGHT
  textFiltering: boolean = false
  allowServerListings: boolean = true

  constructor() {
    super(ClientSettingsPacket.state, ClientSettingsPacket.type)
  }

  encode(): void {
    this.writeString(this.locale)
      .writeByte(this.viewDistance)
      .writeVarint(this.chatMode)
      .writeBoolean(this.colorsEnabled)
      .writeUByte(this.displayedSkinParts)
      .writeVarint(this.mainHand)
      .writeBoolean(this.textFiltering, this.allowServerListings)
  }

  decode(): void {
    this.locale = this.readString()
    this.viewDistance = this.readByte()
    this.chatMode = this.readVarint()
    this.colorsEnabled = this.readBoolean()
    this.displayedSkinParts = this.readUByte()
    this.mainHand = this.readVarint()
    this.textFiltering = this.readBoolean()
    this.allowServerListings = this.readBoolean()
  }
}
