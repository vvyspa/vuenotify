import Vue from 'vue'
import App from './App.vue'
import store from './store'
import Vuenotify from '@/vue-plugin'

Vue.config.productionTip = false

Vue.use(Vuenotify)

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')
