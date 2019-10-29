import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify';
import store from './store'
import router from './router'
import Trend from "vuetrend"
import VueSocketIOExt from 'vue-socket.io-extended';
import io from 'socket.io-client';

const socket = io('https://stock-server.jhellberg.me');
 
Vue.use(VueSocketIOExt, socket);

Vue.config.productionTip = false

Vue.use(Trend)

new Vue({
  vuetify,
  store,
  router,
  render: h => h(App)
}).$mount('#app')
