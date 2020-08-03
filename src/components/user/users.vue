<template>
	<div>
		<!--面包屑导航区-->
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>用户管理</el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>

		</el-breadcrumb>

		<el-card>
			<div class="text item">

				<el-row :gutter="20">
					<el-col :span="7">
						<el-input placeholder="请输入内容">
							<el-button slot="append" icon="el-icon-search"></el-button>
						</el-input>
					</el-col>
					<el-button type="success">添加用户</el-button>

					<el-col :span="4"></el-col>

				</el-row>

			</div>
			<el-table :data="userList" border stripe>
				<!--索引列-->
				<el-table-column label="#" type="index">

				</el-table-column>
				<el-table-column label="姓名" prop="username">

				</el-table-column>

				<el-table-column label="邮箱" prop="email">

				</el-table-column>

				<el-table-column label="电话" prop="mobile">

				</el-table-column>
				<el-table-column label="角色" prop="role_name">

				</el-table-column>
				<el-table-column label="状态">
					<!--作用域插槽，需要补充-->
					<template v-slot="scope">
						<el-switch v-model="scope.row.mg_state" 
							@change="userstatusChange(scope.row)">
						</el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" width="180px">
					<template v-slot="scope">
							<el-button size="small" type="primary" icon="el-icon-edit"></el-button>

							<el-button size="small" type="danger" icon="el-icon-delete"></el-button>
						
						<!--enterable ： false 鼠标不可进入文字提示中，即文字提示会自动消失-->
						<el-tooltip class="item" effect="dark" content="分配角色" placement="top" :enterable="false">
							<el-button size="small" type="warning" icon="el-icon-setting"></el-button>

						</el-tooltip>

					</template>
				</el-table-column>

			</el-table>
			<!--分页条-->
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="queryInfo.pagenum"
		      :page-sizes="[1, 2, 5, 10]"
		      :page-size="queryInfo.pagesize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>

		</el-card>

		</style>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//获取用户列表的参数对象
				queryInfo: {
					query: '',
					pagenum: 1,//当前的页数
					pagesize: 2//当前每页显示多少条数据
				},
				userList: [],
				total: 0
			}
		},
		created() {
			this.getUserList();
		},
		methods: {
			getUserList: async function() {

				const {
					data: res
				} = await this.$http.get('users', {
					params: this.queryInfo
				})
//				console.log(res)
				if(res.meta.status !== 200) return this.$message.error("加载用户列表失败")
				this.userList = res.data.users;
				this.total = res.data.total;
//				console.log(this.userList)

			},
			handleSizeChange:function(newSize){
				//监听pageSize改变的事件
				this.queryInfo.pagesize=newSize;
				this.getUserList();
			},
			handleCurrentChange:function(newPage){
				//监听pageSize改变的事件
				this.queryInfo.pagenum=newPage;
			},
			userstatusChange:async function(userstatus){
				//console.log(userstatus.mg_state)
				const {data:res}=await this.$http.put(`users/${userstatus.id}/state/${userstatus.mg_state}`)
//				console.log(res)
				if(res.meta.status!==200){
					return this.$message.error("设置管理员状态失败")
				}
//				console.log("ok")
			}
		}
	}
</script>

<style lang="less" scoped>

</style>