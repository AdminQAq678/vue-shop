import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import '../assets/css/global.css'
Vue.use(VueRouter)

  const routes = [
{path:'/',component:login},
  {path:"/login",component:login},
  {path:"/home",component:home}
]

const router = new VueRouter({
  routes
})
//路由导航守卫
router.beforeEach((to,from,next)=>{
	//to 要访问的页面
	//from 当前页面
	// next 放行函数
	//放行登录页面
	if(to.path==='/login') return next();
	//获取token
	const tokenStr=window.sessionStorage.getItem("token");
	if(!tokenStr)return next('/login');
	next();
})

export default router
