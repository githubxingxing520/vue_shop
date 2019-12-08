import Vue from 'vue'
// 导入路由模块
import router from './router'
// 导入axios模块
import axios from 'axios'
import App from './App.vue'
// 导入全局css
import './assets/css/global.css'
// 导入字体图标文件
import './assets/fonts/iconfont.css'
// 按需导入element-ui
import { Form, FormItem, Input, Button, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.prototype.$message = Message
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$axios = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
