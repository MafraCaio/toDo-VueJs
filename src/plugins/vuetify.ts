/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      light: {
        colors: {
          primary: '#2E4059',
          secondary: '#1B263B',
          background: '#D8D9D4',
          surface: '#2E4059',
        },
      },
      dark: {
        colors: {
          primary: '#2E4059',
          secondary: '#1B263B',
          background: '#0D1B2A',
          surface: '#2E4059',
        },
      }
    },
  },
})
