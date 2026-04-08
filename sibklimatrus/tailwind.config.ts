import type { Config } from 'tailwindcss'

export default {
  theme: {
    extend: {
      backgroundImage: {
        'landing-surface':
          'radial-gradient(circle at top right, rgba(14, 116, 244, 0.22), transparent 38%), radial-gradient(circle at top left, rgba(6, 182, 212, 0.15), transparent 32%), linear-gradient(180deg, #edf5ff 0%, #deebff 45%, #d2e5ff 100%)',
        'landing-surface-dark':
          'radial-gradient(circle at top right, rgba(34, 211, 238, 0.16), transparent 35%), radial-gradient(circle at top left, rgba(59, 130, 246, 0.18), transparent 30%), linear-gradient(180deg, #020617 0%, #0b1120 48%, #111827 100%)'
      },
      letterSpacing: {
        brand: '0.25em'
      }
    }
  }
} satisfies Config
