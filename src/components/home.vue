<template>
	<el-container class="home_container">
		<el-header>
			<div>
				<img src="../assets/heima.png" />
				<span>电商后台管理系统</span>

			</div>
			<el-button type="info" @click="logout">退出</el-button>
		</el-header>
		<el-container>
			<el-aside :width="toggleFlag?'64px':'200px'">
				
				<div class="toggle_btn" @click="toggle">|||</div>
				<!--
        	作者：offline
        	时间：2020-08-03
        	描述：侧边栏
        -->
				<el-menu unique-opened :collapse="toggleFlag" :collapse-transition="false"  
					background-color="#333744" text-color="#fff" active-text-color="#409eff">
					<!--
      	作者：offline
      	时间：2020-08-03
      	描述：一级菜单
      -->
					<el-submenu  :index="item.id+''" v-for="item in menuList" :key="item.id">
						<!-- 一级-->
						<template slot="title">
							<i :class="iconObj[item.id]"></i>
							<span>{{item.authName}}</span>
						</template>
						<!-- 二级菜单-->
						<el-menu-item :index="subitem.id+''" 
							v-for="subitem in item.children" :key="subitem.id" >
							<template slot="title">
								<i class="el-icon-menu"></i>
								<span>{{subitem.authName}}</span>
							</template>
						</el-menu-item>
					</el-submenu>

				</el-menu>

			</el-aside>
			<el-main>Main

			</el-main>
		</el-container>
	</el-container>

</template>

<script>
	export default {
		data() {
			return {
				menuList: [],
				iconObj:{
					'125':'iconfont icon-user',
					'103':'iconfont icon-tijikongjian',
					'101':'iconfont icon-shangpin',
					'102':'iconfont icon-danju',
					'145':'iconfont icon-baobiao',
				},
				toggleFlag:false

			}
		},
		created() {
			this.getMenuList();
		},
		methods: {

			logout: function() {
				window.sessionStorage.clear();
				this.$router.push("/login")
			},
			getMenuList: async function() {
				const {
					data: res
				} = await this.$http.get('menus')
				console.log(res);
				if(res.meta.status!==200) return this.$message.error("获取菜单失败")
				
				this.menuList = res.data;
				console.log(this.menuList)
			},
			toggle:function(){
				this.toggleFlag=!this.toggleFlag;
			}
		}
	};
</script>

<style lang="less" scoped>
	.el-header {
		background-color: #373d41;
		display: flex;
		justify-content: space-between;
		align-items: center;
		color: white;
		font-size: 20px;
		>div {
			display: flex;
			align-items: center;
			span {
				margin-left: 15px;
			}
		}
	}
	
	.el-aside {
		background-color: #333744;
		transition: .5s;
		.el-menu{
			border-right: 0px;
		}
		
	}
	
	.el-main {
		background-color: #eaedf1;
	}
	
	.home_container {
		height: 100%;
	}
	.iconfont{
		margin-right: 10px;
	}
	.toggle_btn{
		background-color: #4a5064;
		color: white;
		text-align: center;
		font-size: 10px;
		line-height: 24px;
		letter-spacing: 0.3em;
		cursor: pointer;
	}
</style>