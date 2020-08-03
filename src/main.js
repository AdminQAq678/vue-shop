import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/fonts/iconfont.css'

import axios from 'axios'
axios.defaults.baseURL="http://localhost:8888/api/private/v1/"
//设置axio的请求拦截器，挂载请求头Authorization为token
axios.interceptors.request.use(config=>{

config.headers.Authorization= window.sessionStorage.getItem("token");
//console.log(config)
	return config
})
Vue.prototype.$http=axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
