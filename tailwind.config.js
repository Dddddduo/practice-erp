module.exports = {
  content: [
    './src/pages/**/*.tsx',
    './src/components/**/*.tsx',
    './src/layouts/**/*.tsx',
  ],
  theme: {
    extend: {
      fontSize: {
        'btn-default': ['0.875rem', { fontWeight: '400' }], // 14px
        'small': ['0.6rem', { fontWeight: '400' }], // 10px
        'label': ['0.75rem', { fontWeight: '400' }], // 12px
        'title': ['1rem', { fontWeight: '400' }], // 16px
        'large': ['1.125rem', { fontWeight: '600' }], // 18px
      },
      spacing: {
        '12p': '0.75rem',
        '16p': '1rem',
      },
      borderRadius: {
        '1xl': '0.4rem',
        '2xl': '0.5rem',
      }
    }
  }
}
