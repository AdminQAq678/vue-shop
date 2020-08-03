import Vue from 'vue'

import { Header,
	Main,Aside,
	Container,
	Form, 
	FormItem,
	Button, 
	Input, 
	Message,
	Menu,
	Submenu,
	MenuItem

} from 'element-ui'

Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Button)
Vue.use(Main)

Vue.use(Aside)
Vue.use(Header)
Vue.use(Container)


Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)

//Message 需要挂在到vue的全局对象中
Vue.prototype.$message = Message