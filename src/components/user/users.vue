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
						<el-input type="text" v-model="queryInfo.query" placeholder="请输入内容" clearable @clear="getUserList" >
							<el-button slot="append" icon="el-icon-search" @click="getUserList()"></el-button>
						</el-input>
					</el-col>
					<el-button type="success" @click="dialogVisible=true">添加用户</el-button>

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
						<!--修改用户信息-->
							<el-button @click="showEditUserDialog(scope.row.id)" size="small" type="primary" icon="el-icon-edit"></el-button>

							<el-button size="small" type="danger" icon="el-icon-delete" @click='removeUserById(scope.row.id)'></el-button>
						
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
		<!--对话框-->
		<el-dialog
		  title="添加用户"
		  :visible.sync="dialogVisible"
		  width="50%"
		  >
		  <!--内容主题-->
		 
			  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm" @closed="addFormReset">
				  <el-form-item label="用户名" prop="username">
				    <el-input v-model="ruleForm.username"></el-input>
				  </el-form-item>
				    <el-form-item label="密码" prop="password">
				    <el-input v-model="ruleForm.password"></el-input>
				  </el-form-item>
				    <el-form-item label="邮箱" prop="email">
				    <el-input v-model="ruleForm.email"></el-input>
				  </el-form-item>
				    <el-form-item label="手机号码" prop="mobile">
				    <el-input v-model="ruleForm.mobile"></el-input>
				  </el-form-item>
			  </el-form>
		  <!--底部区域-->
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="dialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addUser">确 定</el-button>
		  </span>
		</el-dialog>
		<!--编辑用户信息对话框-->
		<el-dialog
		  title="编辑用户信息"
		  :visible.sync="EditUserDialogShowing"
		  width="50%"
		  @close="editFormReset"
		  >
		  <!--内容主题-->
		 
			  <el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px"  >
				  <el-form-item label="用户名" prop="username" >
				    <el-input v-model="editForm.username" disabled></el-input>
				  </el-form-item>
				    <el-form-item label="邮箱" prop="email">
				    <el-input v-model="editForm.email"></el-input>
				  </el-form-item>
				    <el-form-item label="手机号码" prop="mobile">
				    <el-input v-model="editForm.mobile"></el-input>
				  </el-form-item>
			  </el-form>
		  <!--底部区域-->
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="EditUserDialogShowing=false">取 消</el-button>
		    <el-button type="primary" @click="editUser">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			//自定义验证规则
			var checkEmail=(rule,value,callback)=>{
					const regEmail= /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/
					if(regEmail.test(value)){
						//邮箱合法
						return callback();
					}
					callback(new Error("请输入合法的邮箱"));
				}
				var checkMobile=(rule,value,callback)=>{
					const regMobile=/^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
					if(regMobile.test(value)){
						return callback();
					}
					callback(new Error("请输入合法的手机号码"));
				}
		
			return {
				
				//获取用户列表的参数对象
				search_msg:'',
				queryInfo: {
					query: '',
					pagenum: 1,//当前的页数
					pagesize: 10//当前每页显示多少条数据
				},
				userList: [],
				total: 0,
//				设置对话框是否可见
				dialogVisible:false,
				EditUserDialogShowing:false,
//				添加用户表单对象
				ruleForm:{
					username:'',
					password:'',
					email:'',
					mobile:''
					
				},
//				编辑用户信息表单对象
				editForm:{
					username:'',
					email:'',
					mobile:''
				},
				//验证规则
				rules:{
					username:[
					{
						required:true,message:"请输入用户名",
						trigger:'blur'
					},
						{
							min:3,
							max:10,
							message:'用户名的长度在3~10个字符之间',
							trigger:'blur'
						}
					],
					password:[
						{
							required:true,message:"请输入密码",
							trigger:'blur'
						},
						{
							min:6,
							max:15,
							message:'密码的长度在3~10个字符之间',
							trigger:'blur'
						}
					],
					email:[
						{
							required:true,message:"请输入邮箱",
							trigger:'blur'
						},
						{
							validator:checkEmail,
							trigger:'blur'
						}
					
					],
					mobile:[
						{required:true,message:"请输入手机号码",
						trigger:'blur'
						},
						{
							validator:checkMobile,
							trigger:'blur'
						}
					
					]
					
			},
			editFormRules:{
				username:[
					{
						required:true,message:"请输入用户名",
						trigger:'blur'
					},
						{
							min:3,
							max:10,
							message:'用户名的长度在3~10个字符之间',
							trigger:'blur'
						}
					],
					email:[
						{
							required:true,message:"请输入邮箱",
							trigger:'blur'
						},
						{
							validator:checkEmail,
							trigger:'blur'
						}
					
					],
					mobile:[
						{required:true,message:"请输入手机号码",
						trigger:'blur'
						},
						{
							validator:checkMobile,
							trigger:'blur'
						}
					
					]
			}
				
				
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
				//重新获取用户数据
				this.getUserList();
			},
			userstatusChange:async function(userstatus){
				//console.log(userstatus.mg_state)
				const {data:res}=await this.$http.put(`users/${userstatus.id}/state/${userstatus.mg_state}`)
//				console.log(res)
				if(res.meta.status!==200){
					return this.$message.error("设置管理员状态失败")
				}
//				console.log("ok")
			},
//			添加用户表单重置函数
			addFormReset:function(){
				this.$refs.ruleForm.resetFields();
			},
			addUser:function(){
				this.$refs.ruleForm.validate( async valid=>{
					console.log(valid)
					if(!valid){
						return ;
					}
					//发起请求
					const {data:res}= await this.$http.post('users',this.ruleForm);
					console.log(res)
					if(res.meta.status!=201){
						return this.$message.error("添加用户失败")
					}
					this.dialogVisible=false;
					 this.$message.success("添加用户成功");
					 this.getUserList();
					 
				});
			},
			
			showEditUserDialog:async function(id){
				//
				
				//获取查询到的用户数据
				const {data:res}= await this.$http.get('users/'+id);
				
				this.editForm=res.data;
				
				this.EditUserDialogShowing = true;
				
				
//				this.editForm.username=value.username;
//				this.editForm.email=value.email;
//				this.editForm.mobile=value.mobile;
				
			},
			editUser:function(){
				this.$refs.editForm.validate( async valid=>{
					console.log(valid)
					if(!valid) return;
					const {data:res}= await this.$http.put('users/'+this.editForm.id,
					{email:this.editForm.email,mobile:this.editForm.mobile}
					);
					console.log(res.meta.status)
					if(res.meta.status!==200) return this.$message.error("更新用户数据失败");
					//关闭对话框
					this.EditUserDialogShowing=false;
					this.getUserList();
					this.$message.success("更新用户数据成功");
				})
			},
			//重置编辑用户对话框表单
			editFormReset:function(){
				this.$refs.editForm.resetFields();
			},
			removeUserById:async function(id){
				const result = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
			          confirmButtonText: '确定',
			          cancelButtonText: '取消',
			          type: 'warning'
			        }).catch((err) => {
			          this.$message({
			            type: 'info',
			            message: '已取消删除'
			          });
			          return err;
			        });
			        if(result==='confirm'){
			        	//this.$message.success("确认了删除")
			        	const {data:res}=await this.$http.delete('users/'+id);
			        	console.log(res)
			        	if(res.meta.status!==200){
			        		return this.$message.error("删除用户失败")
			        	}
			        	this.$message.success("删除用户成功")
			        	this.getUserList()
			        }
			}
		}
	}
</script>

<style lang="less" scoped>

</style>