import Vue from 'vue'
import Vuetify from 'vuetify/lib/framework'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: '#005089',
        secondary: '#B21127'
      },
      dark: {
        primary: '#005089',
        secondary: '#B21127'
      }
    },
    options: { customProperties: true }
  }
})
