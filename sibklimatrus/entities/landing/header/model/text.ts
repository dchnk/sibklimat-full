export interface I18nText {
  mode: 'i18n'
  value: string
}

export interface RawText {
  mode: 'raw'
  value: string
}

export type HeaderText = I18nText | RawText

export const i18nText = (key: string): I18nText => ({
  mode: 'i18n',
  value: key
})

export const rawText = (value: string): RawText => ({
  mode: 'raw',
  value
})
