import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/login.vue'
import home from '../components/home.vue'
import welcome from '../components/welcome.vue'
import users from '../components/user/users.vue'
import roles from '../components/privi/roles.vue'
import rights from '../components/privi/rights.vue'
import '../assets/css/global.css'
Vue.use(VueRouter)
//解决路由多次定向到同一位置报错
const originalPush = VueRouter.prototype.push
   VueRouter.prototype.push = function push(location) {
   return originalPush.call(this, location).catch(err => err)
}
  const routes = [
{path:'/',component:home},
  {path:"/login",component:login},
  
  //home重定向到/welcome 显示子路由
  {path:"/home",component:home,redirect:"/welcome",children:[
	  {path:"/welcome",component:welcome},
	  {path:"/users",component:users},
	  {path:"/roles",component:roles},
	  {path:"/rights",component:rights}
 	 ]
  }
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
