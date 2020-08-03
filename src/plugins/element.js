import Vue from 'vue'

import { Form,FormItem,Button,Input,Message } from 'element-ui'


Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
//Message 需要挂在到vue的全局对象中
Vue.prototype.$message=Message