import type { HeaderText } from './text'

export const resolveHeaderText = (
  text: HeaderText,
  translate: (key: string) => string
): string => {
  if (text.mode === 'raw') {
    return text.value
  }

  return translate(text.value)
}
