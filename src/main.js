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
import TreeTable from 'vue-table-with-tree-grid'
// 导入格式化时间模块
import moment from 'moment'
// 导入vue-quill-editor组件
import VueQuillEditor from 'vue-quill-editor'
// require styles导入quill-editor的css文件
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {
  Form,
  FormItem,
  Input,
  Button,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  Submenu,
  MenuItem,
  Breadcrumb,
  BreadcrumbItem,
  Card,
  Row,
  Col,
  Table,
  TableColumn,
  Switch,
  Tooltip,
  Pagination,
  Dialog,
  MessageBox,
  Tag,
  Tree,
  Select,
  Option,
  Cascader,
  Alert,
  Tabs,
  TabPane,
  Steps,
  Step,
  CheckboxGroup,
  Checkbox,
  Upload,
  Timeline,
  TimelineItem
} from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Button)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(CheckboxGroup)
Vue.use(Checkbox)
Vue.use(Upload)
Vue.use(VueQuillEditor)
Vue.use(Timeline)
Vue.use(TimelineItem)
Vue.component('tree-table', TreeTable)
Vue.prototype.$message = Message
Vue.prototype.$confirm = MessageBox.confirm
Vue.config.productionTip = false
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
  // Do something before request is sent
  // 为请求头添加token
  config.headers.Authorization = window.sessionStorage.getItem('xs')
  return config
})
Vue.filter('dateFormat', function (time, format) {
  return moment(time).format(format)
})
Vue.prototype.$axios = axios
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
