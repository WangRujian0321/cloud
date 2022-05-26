import Vue from 'vue'
import App from './App.vue'
import './plugins/element'
import router from './router/index'
import store from "@/store";


// Vue.config.productionTip = false
import "./assets/css/base.css"
import "element-ui/lib/theme-chalk/index.css"

import {request} from "@/api/request";
Vue.prototype.$request = request;


new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
