// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import store from './store.js'
import 'vue-github-buttons/dist/vue-github-buttons.css'
import VueGitHubButtons from 'vue-github-buttons'

Vue.config.productionTip = false
Vue.use(VueGitHubButtons, {useCache: true})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  template: '<App/>',
  components: { App },
  store
})
