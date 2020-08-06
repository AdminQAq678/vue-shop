<template>
	<div>
		<el-breadcrumb separator-class="el-icon-arrow-right">
			<el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item>权限管理</el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
			
		</el-breadcrumb
		<el-card>
			<el-row>
				<el-col>
				<el-button>
					添加角色
				</el-button>
				</el-col>
			</el-row>
			<el-table :data="roleList" border stripe>
				<el-table-column type="expand" label="#">
					<template slot-scope="scope">
						<el-row  :class="['bdbm',i1===0?'bdtop':'','vcenter'] " v-for="(item1,i1) in scope.row.children" :key="item1.id">
							<!--一级权限-->
							<el-col :span="5">
								<el-tag @close="closeRightsById(scope.row,item1.id)" closable>
									{{item1.authName}}
									
								</el-tag>
								<i class="el-icon-caret-right"></i>
							</el-col>
							<el-col :span="19">
								<el-row   :class=" [ i2===0 ? '' : 'bdtop','vcenter'] "  v-for="(item2,i2) in item1.children" >
									<el-col :span="6">
										<el-tag type="success" @close="closeRightsById(scope.row,item2.id)" closable>
											{{item2.authName}}
										</el-tag>
										<i class="el-icon-caret-right"></i>
									</el-col>
									<el-col :span="18">
										
											<el-tag @close="closeRightsById(scope.row,item3.id)" closable type="warning" v-for="(item3,i3) in item2.children">
											{{item3.authName}}
											</el-tag>
										
										
									</el-col>
								</el-row>
							</el-col>
								
							
						</el-row>
					
					</template>
				</el-table-column>
				
				<el-table-column type="index" label="#">
					
				</el-table-column>
				<el-table-column  label="角色列表" prop="roleName">
					
				</el-table-column>
				<el-table-column  label="角色描述" prop="roleDesc">
					
				</el-table-column>
				<el-table-column  label="操作" >
					<template slot-scope="scope">
						
						
						<el-button type="primary" size="small" icon="el-icon-eidt">
							编辑
						</el-button>
						<el-button type="danger" size="small" icon="el-icon-delete">
							删除
						</el-button>
						<el-button @click="showSetRightsDialog(scope.row)" type="warning" size="small" icon="el-icon-setting">
							分配权限
						</el-button>
					</template>
				</el-table-column>
			</el-table>
			
			
		</el-card>
		<el-dialog
		title="分配权限"
		:visible.sync="RightsDialogVisible"
		width="50%"
		@close="RightsDialogClose"
		>
		<!-- node-key 以id作为复选框被选中时候的值 -->
		<el-tree 
		ref="treeRef"
		:default-checked-keys="defKeys" 
		default-expand-all node-key="id" 
		show-checkbox :data="rightsData" :props="treeProps"  >

		</el-tree >
		<span slot="footer" class="dialog-footer">
			<el-button @click="RightsDialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="allocRights">确 定</el-button>
		</span>
		</el-dialog>
	</div>
</template>

<script>


	export default {
		data(){
			return {
				roleList:[],
				RightsDialogVisible:false,
				rightsData:[],
				//树形控件的绑定对象
				treeProps:{
					children:'children',
					label:'authName'
				},
				defKeys:[],
				roleId:''


			}
		},
		created(){
			this.getRoleList();
		},
		methods:{
			getRoleList:async function(role,rightsId){
				const {data:res}=await this.$http.get('roles');
				if(res.meta.status!==200){
					return this.$message.erroe("活跃角色列表失败")
				}
				this.roleList=res.data;
				console.log(this.roleList)
			},
			closeRightsById:async function(role,rightsId){
					const result=await this.$confirm('是否删除该权限','提示',{
						confirmButtonText:'确定',
						cancelButtonText:'取消',
						type:'warning'
					}
				).catch(err=>err)
				
				if(result!== 'confirm'){
					return this.$message.info('取消了删除！')
				}
				
				const {data:res}= await this.$http.delete(`roles/${role.id}/rights/${rightsId}`);
				console.log(res)
				if(res.meta.status!==200){
					return this.$message.error("删除权限失败");
				}
//				this.getRoleList();
				role.children=res.data;
			},
			//展示分配权限的对话框
			showSetRightsDialog:async function(role){
				

				const {data:res}= await this.$http.get('rights/tree');
				
				if(res.meta.status!==200)
				return this.$message.error("获取权限数据失败");
				//保存权限列表数据
				this.rightsData=res.data;
				console.log('获取权限列表',this.rightsData);
				
				this.getLeavesKey(role,this.defKeys)
				this.roleId=role.id;
				this.RightsDialogVisible=true;
			},
			RightsDialogClose:function(){
				this.defKeys=[]
			},
			handleNodeClick:function(){

			},
			//递归获取三级节点id
			getLeavesKey:function(node,arr){
					if(!node.children){
						//当前node节点不包含childremn属性，为三级节点
						arr.push(node.id);
						return ;
					}
					node.children.forEach(element => {
						this.getLeavesKey(element,arr)
					});
			},
			allocRights:async function(){
				//获取全选和半选中的多选框
					const keys=[
						//展开
						...this.$refs.treeRef.getCheckedKeys(),
						...this.$refs.treeRef.getHalfCheckedKeys()
					]
					console.log(keys)
					//将数组转成字符串
					const  idstr=keys.join(',');
					console.log(idstr)
					const {data:res}
					 =await this.$http.post(`roles/${this.roleId}/rights`,{rids:idstr});
					 if(res.meta.status!==200){
						 return this.$message.error("分配权限失败")
					 }
					 this.getRoleList();//获取角色列表
					 this.$message.success("分配权限成功");
					 //隐藏对象框
					 this.RightsDialogVisible=false;

			}
		}
	}
</script>

<style lang="less" scoped>

.el-tag{
	margin: 7px;
}
.bdtop{
	border-top: 1px solid #eee;
}
.bdbm{
	border-bottom: 1px solid #eee;
}
.vcenter{
	display: flex;
	align-items: center;
}
</style>