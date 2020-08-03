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
	MenuItem,
	breadcrumb,
	breadcrumbItem,
	Card,
	Row,
	Col,
	Table,
	TableColumn,
	Switch,
	Tooltip,
	Pagination

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
Vue.use(breadcrumb)
Vue.use(breadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
//Message 需要挂在到vue的全局对象中
Vue.prototype.$message = Message