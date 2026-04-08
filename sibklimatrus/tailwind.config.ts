import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      backgroundImage: {
        'landing-surface':
          'radial-gradient(circle at top right, rgba(8, 145, 178, 0.12), transparent 36%), linear-gradient(180deg, #f8fafc 0%, #f1f5f9 42%, #ffffff 100%)',
        'landing-surface-dark':
          'radial-gradient(circle at top right, rgba(34, 211, 238, 0.16), transparent 35%), radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 30%), linear-gradient(180deg, #020617 0%, #0b1120 48%, #111827 100%)'
      },
      letterSpacing: {
        brand: '0.25em'
      }
    }
  }
} satisfies Config
