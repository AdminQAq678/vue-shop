<template>
	<div class="login_container">
		<div class="login_box">
			<div class="avatar_box">
				<img src="../assets/logo.png" />
				
			</div>
			
			<el-form ref="loginformRef" :rules="loginform_rules" :model="loginform" label-width="0px" class="login_form">
					  <el-form-item prop="username">
					    <el-input v-model="loginform.username"
					    	prefix-icon="el-icon-user"></el-input>
					  </el-form-item>
					  
					  <el-form-item prop="password">
					    <el-input v-model="loginform.password" type="password"
					    	 prefix-icon="el-icon-lock"></el-input>
					  </el-form-item>
					    <el-form-item class="btns" >
						  <el-button type="primary" @click="login" >
						  	登录
						  </el-button>
						  <el-button type="info" @click="reset">
						  	重置
						  </el-button>
					  </el-form-item>
			</el-form>
		</div>
		 </div>
</template>

<script>
	export default{
		data(){
			return {
				loginform:{
					username:"admin",
					password:"123456"
				},
				loginform_rules: {
					username:[ 
					{ required: true, message: '请输入用户名', trigger: 'blur' },
            		{ min: 5, max: 12, message: '长度在 5 到 512个字符', trigger: 'blur' }],
					password:[
					 { required: true, message: '请输入密码', trigger: 'blur' },
            			{ min: 6, max: 16, message: '长度在 6到 16个字符', trigger: 'blur' }
					]
				}
			}
		},
		mounted(){
			this.scroll = new Bscroll(this.$refs.wrapper, { mouseWheel: true, click: true, tap: true })
		},
		methods:{
			reset:function(){
				//重置表单
				
				this.$refs.loginformRef.resetFields();
			},
			login:function(){
				//登录预验证
				this.$refs.loginformRef.validate( async (valid)=>{
					//valid为验证结果
//					console.log(valid);
					if(!valid){
						return ;
					}
					//解构data属性，重命名为res
					const {data:res}= await this.$http.post("login",this.loginform);
//					console.log(res)
					if(res.meta.status!=200){
						console.log(res.meta.msg)
						return this.$message.error("登录失败")
						
					}
					 this.$message.success("登录成功");
					 
					 //保存token
					 window.sessionStorage.setItem("token",res.data.token)
					 
					 //编程式导航跳转
					 this.$router.push("/home")
					
				});
			}
		}
	};
</script>

<style lang="less" scoped>
	.login_container{
		background-color:#2b4b6b;
		height: 100%;
	}
	.login_box{
		width: 450px;
		height: 300px;
		background-color: #fff;
		border-radius: 3px;
		position: absolute;
		left: 50%;
		top: 50%;
		transform: translate(-50%,-50%);
	}
	.avatar_box{
		height: 130px;
		width: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		box-shadow: 0 0 10px #ddd;
		padding: 10px;
		background-color: white;
		position: absolute;
		left: 50%;
		transform: translate(-50%,-50%);
		img{
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background-color: #eee;
			
		}
	}
	.btns{
		display: flex;
		justify-content: flex-end;
	}
	.login_form{
		position: absolute;
		bottom: 0;
		width: 100%;
		padding: 20px;
		box-sizing: border-box;
		
	}
</style>