export interface JSONChatComponent {
  text?: string
  bold?: boolean
  italic?: boolean
  underlined?: boolean
  strikethrough?: boolean
  obfuscated?: boolean
  color?: string
  insertion?: string
  clickEvent?: {
    open_url?: string
    run_command?: string
    suggest_command?: string
    change_page?: number
    copy_to_clipboard?: string
  }
  hoverEvent?: {
    show_text?: string
    show_item?: string
    show_entity?: string
  }
  font?: 'minecraft:uniform' | 'minecraft:alt' | 'minecraft:default'
  extra?: JSONChatComponent[]
}
