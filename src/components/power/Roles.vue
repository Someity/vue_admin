<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- ------------添加角色按钮区域  行------------->
      <el-row>
        <!-- 列 -->
        <el-col>
          <el-button type="primary" @click="addDialogVisble = true"
            >添加角色</el-button
          >
        </el-col>
      </el-row>
      <!-- -----------角色列表区域 ------------------>
      <el-table :data="rolelist" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- 栅格布局  将页面分为24列-->
            <el-row
              :class="['bdbottom', index1 === 0 ? 'bdtop' : '', 'vcenter']"
              :key="item1.id"
              v-for="(item1, index1) in scope.row.children"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <el-tag
                  closable
                  @close="removeRolesByIdd(scope.row, item1.id)"
                  >{{ item1.authName }}</el-tag
                >
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级和三级 -->
              <el-col :span="19">
                <el-row
                  :class="['bdtop', index2 === 0 ? '' : 'bdtop', 'vcenter']"
                  v-for="(item2, index2) in item1.children"
                  :key="item2.id"
                >
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="removeRolesByIdd(scope.row, item2.id)"
                      >{{ item2.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag
                      v-for="item3 in item2.children"
                      :key="item3.id"
                      type="warning"
                      closable
                      @close="removeRolesByIdd(scope.row, item3.id)"
                    >
                      {{ item3.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
                    {{ scope.row }}
                </pre
            > -->
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="300px">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeRolesById(scope.row.id)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-setting"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!--  --------添加角色对话框 -------- -->
    <el-dialog
      title="添加角色"
      :visible.sync="addDialogVisble"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 参数解释 -->
      <!--对话框的标题文字 -->
      <!-- 属性绑定 控制对话框的显示 隐藏值为 true false -->
      <!-- 对话框的宽度  （站屏幕宽度的一半-->
      <!-- 添加close事件当表单关闭时触发 目的重置表单 -->
      <!-- --------------------------------------------------- -->
      <!-- 内用主题区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <!-- 参数解释 -->
        <!-- 数据绑定 -->
        <!-- 规则绑定集 -->
        <!-- 引用对象 -->
        <!-- 表单文本所占宽度 -->
        <el-form-item label="角色名称" prop="roleName">
          <!-- prop 规则的绑定 addFormRules中的规则 -->
          <el-input v-model="addForm.roleName"></el-input>
          <!-- v-model 双向绑定 -->
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addRoles"> 确 定</el-button>
      </span>
    </el-dialog>
    <!-- -------------修改用户对话框---------- -->
    <el-dialog
      title="修改角色"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 表单输入框 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="80px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
          <!-- disabled : 禁用当前输入框 -->
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRolesInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- -------------分配权限对话框----------- -->
    <el-dialog
      title="分配权限"
      :visible.sync="setRightDialogVisible"
      width="50%"
      @close="setRightDialogClosed"
    >
      <!-- 树形控件 -->
      <el-tree
        :data="rightslist"
        :props="treeProps"
        show-checkbox
        node-key="id"
        default-expand-all
        :default-checked-keys="defKeys"
        ref="treeRef"
      >
        <!-- 参数解释
       1：绑定数据源 
       2： 设置数据源绑定对象属性 
       3: 选项框
       4: 唯一id值
       5: 是否默认展开全部节点
       6: 默认勾选的节点的 key 的数组
       -->
      </el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 所有角色列表数据
      rolelist: [],
      // ---------- 添加角色 ----------
      // 控制添加角色对话框显示与隐藏
      addDialogVisble: false,
      // 添加角色的用户表单数据
      addForm: {
        roleName: '',
        roleDesc: '',
      },
      // 添加角色的验证规则
      addFormRules: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请填写角色描述', trigger: 'blur' },
        ],
      },
      // -----------编辑角色 ----------
      // 控制编辑角色对话框显示与隐藏
      editDialogVisible: false,
      // 编辑角色的用户表单数据
      editForm: {},
      // 编辑角色的验证规则
      editFormRules: {
        roleName: [
          { required: true, message: '请填写角色名称', trigger: 'blur' },
        ],
        roleDesc: [
          { required: true, message: '请填写角色描述', trigger: 'blur' },
        ],
      },
      // ----------- 分配权限 ---------
      // 控制分配权限对话框显示与隐藏
      setRightDialogVisible: false,
      // 权限列表表单数据
      rightslist: '',
      // 树形控件的绑定对象
      treeProps: {
        //   显示那个数据的名称
        label: 'authName',
        //   子结构分支名称
        children: 'children',
      },
      // 默认选中的权限节点ID值
      defKeys: [],
      // 当前即将分配权限的id
      roleId: '',
    }
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$messsge.error('获取角色列表失败')
      }
      this.rolelist = res.data
      // console.log(this.rolelist)
    },
    // 点击确认按钮 添加角色
    addRoles() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        //  预先验证
        if (!valid) return
        //  验证成功
        const { data: res } = await this.$http.post('roles', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加角色失败')
        }
        this.$message.success('添加角色成功')
        // 隐藏添加用户对话框
        this.addDialogVisble = false
        //  重新获取用户数据
        this.getRolesList()
      })
    },
    // 监听添加用户动画框的关闭事件
    addDialogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 展示修改角色的对话框
    async showEditDialog(id) {
      // console.log(id);
      // 根据id查询用户信息
      const { data: res } = await this.$http.get('roles/' + id)
      // 查询失败
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      // 查询成功 将信息保存到私有数据中
      this.editForm = res.data
      //   弹出对话框
      this.editDialogVisible = true
    },
    // 监听修改角色动画框的关闭事件
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },
    // 点击按钮修改角色
    editRolesInfo() {
      // 预验证 用户修改信息的值
      this.$refs.editFormRef.validate(async (valid) => {
        //   console.log(valid);
        if (!valid) return
        // 发送请求
        const { data: res } = await this.$http.put(
          'roles/' + this.editForm.roleId,
          {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          }
        )
        // 判断是否更新成功
        if (res.meta.status !== 200) {
          // 更新失败
          return this.$message.error('更新角色信息失败')
        }
        // 更新成功
        // 关闭对话框
        this.editDialogVisible = false
        // 重新获取数据
        this.getRolesList()
        // 提示信息
        this.$message.success('更新角色信息成功')
      })
    },
    // 点击按钮删除用户信息
    async removeRolesById(id) {
      // console.log(id);
      const confirmResult = await this.$confirm(
        '此操作将永久删除该角色, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)
      // 确认删除 返回值 字符串 confirm
      // 取消删除 返回值 字符串 cancel
      //   console.log(confirmResult)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      const { data: res } = await this.$http.delete('roles/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      // 重新获取数据
      this.getRolesList()
    },
    // 根据id删除对应的权限
    async removeRolesByIdd(role, rightId) {
      // 弹窗用户是否删除
      const confirmResult = await this.$confirm(
        '此操作将永久删除该文件, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      // 判断用户是否删除
      if (confirmResult !== 'confirm') {
        return this.$message.info('取消了删除')
      }
      const { data: res } = await this.$http.delete(
        `roles/${role.id}/rights/${rightId}`
      )
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户权限失败')
      }
      // 会造成页面的重新绘制
      // this.getRolesList()
      role.children = res.data
    },
    // 展示分配权限对话框
    async showSetRightDialog(row) {
      // 获取当前选择用户的id 值
      this.roleId = row.id
      // 发起请求获取权限列表
      const { data: res } = await this.$http.get('rights/tree')
      if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败')
      }
      // 获取成功赋值给私有数据
      this.rightslist = res.data
      // 递归获取三级节点的id
      this.getLeafKeys(row, this.defKeys)

      // 弹起对话框
      this.setRightDialogVisible = true
    },
    // 通过递归的形式,获取角色下所有的三级权限的id,并保存到defKeys数组中
    getLeafKeys(node, arr) {
      // 如果当前node节点中不包含children属性则是三级节点
      if (!node.children) {
        return arr.push(node.id)
      }
      // 利用递归的形式在次循环
      node.children.forEach((item) => this.getLeafKeys(item, arr))
    },
    // 监听分配权限对话框的关闭时间
    setRightDialogClosed() {
      this.defKeys = []
    },
    // 点击分配权限
    async allotRights() {
      // 先获取当前半选 全选的 id
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys(),
      ]
      // 字符串拼接
      const idStr = keys.join(',')
      const { data: res } = await this.$http.post(
        `roles/${this.roleId}/rights`,
        { rids: idStr }
      )
      if (res.meta.status !== 200) {
        return this.$message.error('权限分配失败')
      }
      this.$message.success('分配权限成功')
      this.getRolesList()
      this.setRightDialogVisible = false
    },
  },
  created() {
    //   页面加载完成立即调用角色列表
    this.getRolesList()
  },
}
</script>
<style lang="less" scoped>
.el-tag {
  margin: 7px;
}
.bdbottom {
  border-bottom: 1px solid #eee;
}
.bdtop {
  border-top: 1px solid #eee;
}
// 居中对齐
.vcenter {
  display: flex;
  align-items: center;
}
</style>