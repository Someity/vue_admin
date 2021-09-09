<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card class="box-card">
      <!-- 搜索与添加区域 -->
      <!-- 栅格布局 el- row  gutter:列于列之间的间隔-->
      <el-row :gutter="20">
        <!-- 列 基础为24栏-->
        <el-col :span="9">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisble = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="用户名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChanged(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 修改 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配 -->
            <el-tooltip
              :enterable="false"
              effect="dark"
              content="分配角色"
              placement="top"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分页区域 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[1, 2, 5, 10]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
      <!-- 参数解释 -->
      <!-- 监听最新的pagesize(当前每页显示多少数据) 发生变化是赋值给定义的数据并发送一次数据请求-->
      <!-- 监听最新的页码值  发生变化是赋值给定义的数据并 发送一次数据请求-->
      <!-- 当前页码数 -->
      <!-- 当前页显示多少条数据(页面的设置数据) -->
      <!-- 当前显示多少条数据(页面显示的数据) -->
      <!-- 当前分页区域功能选择 -->
      <!-- 当前总共有多少页 -->
    </el-pagination>
    <!--  添加用户对话框 -->
    <el-dialog
      title="添加用户"
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
        label-width="70px"
      >
        <!-- 参数解释 -->
        <!-- 数据绑定 -->
        <!-- 规则绑定集 -->
        <!-- 引用对象 -->
        <!-- 表单文本所占宽度 -->
        <el-form-item label="用户名" prop="username">
          <!-- prop 规则的绑定 addFormRules中的规则 -->
          <el-input v-model="addForm.username"></el-input>
          <!-- v-model 双向绑定 -->
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="addUser"> 确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 表单输入框 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名">
          <el-input v-model="editForm.username" disabled></el-input>
          <!-- disabled : 禁用当前输入框 -->
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog 
    title="分配角色" 
    :visible.sync="setRoleDialogVisble" 
    width="50%"
    @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户:{{ userInfo.username }}</p>
        <p>当前的角色:{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <!-- 双向绑定一个具体的值   选择框默认的文字-->
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
            <!-- 参数解释 -->
            <!-- 通过循环来将选项渲染出来 -->
            <!-- 当前项所对应的id -->
            <!-- 所有渲染出来的文本数据 -->
            <!-- 最终选中的值 -->
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisble = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    //  ----------- 自定义校验规则-------
    // 验证邮箱的规则 2带校验的值 3回调函数
    var checkEmail = (rule, value, cb) => {
      // 验证邮箱的正则
      const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
      // 验证
      if (regEmail.test(value)) {
        // 验证通过
        return cb()
      }
      // 验证失败
      cb(new Error('请输入合法的邮箱'))
    }
    // 验证手机号的规则
    var checkMobile = (rule, value, cb) => {
      const reg = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      if (reg.test(value)) {
        // 验证通过
        cb()
      }
      // 验证失败
      cb(new Error('请输入合法的手机号码'))
    }
    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 查询信息
        query: '',
        // 当前的页数
        pagenum: 1,
        // 当前每页显示多少数据
        pagesize: 2,
      },
      //   用户总数据
      userlist: [],
      //   总数据条数
      total: 0,
      // 控制对话框显示与隐藏
      addDialogVisble: false,
      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        email: '',
        mobile: '',
      },
      //添加用户表单验证规则对象
      addFormRules: {
        username: [
          // required：是否为必填项 message：提示信息 trigger：校验时机（blur：鼠标失去焦点后
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在 3 到 10 个字符之前',
            trigger: 'blur',
          },
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在 6 到 15 个字符之前',
            trigger: 'blur',
          },
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 控制修改用户框的显示与隐藏
      editDialogVisible: false,
      //  查询按钮查询到的数据
      editForm: {},
      // 修改表单规则验证名称
      editFormRules: {
        email: [
          { required: true, message: '请输入用户邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],
        mobile: [
          { required: true, message: '请输入用户手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' },
        ],
      },
      // 控制配分角色对话框
      setRoleDialogVisble: false,
      // 需要被分配角色的用户信息
      userInfo: '',
      // 所有角色的数据列表(分配角色需要)
      rolesList: '',
      // 已选中当前的角色 ID
      selectedRoleId: '',
    }
  },
  methods: {
    // 获取数据
    async getUserList() {
      // 通过get请求获取到数据 并对数据进行判断赋值
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }
      //获取数据赋值
      console.log(res);
      this.userlist = res.data.users
      this.total = res.data.total
    },
    // 分页栏 pagesize发生变化是触发
    handleSizeChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },
    // 分页栏 页码之发生改变的事件
    handleCurrentChange(newSize) {
      // console.log(newSize)
      this.queryInfo.pagenum = newSize
      this.getUserList()
    },
    // 用户状态修改   ------监听数据列表的状态按钮将结果传入数据库中
    async userStateChanged(userinfo) {
      console.log(userinfo)
      const { data: res } = await this.$http.put(
        `users/${userinfo.id}/state/${userinfo.mg_state}`
      )
      if (res.meta.status !== 200) {
        userinfo.methods = !userinfo.mg_state
        return this.$message.error('更新用户失败 !')
      }
      this.$message.success('更新用户状态成功 !')
    },
    // 监听添加用户动画框的关闭事件
    addDialogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },
    // 点击按钮添加新用户
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        //  预先验证
        if (!valid) return
        //  验证成功
        const { data: res } = await this.$http.post('users', this.addForm)
        if (res.meta.status !== 201) {
          this.$message.error('添加用户失败')
        }
        this.$message.success('添加用户成功')
        // 隐藏添加用户对话框
        this.addDialogVisble = false
        //  重新获取用户数据
        this.getUserList()
      })
    },
    // 展示编辑用户的对话框
    async showEditDialog(id) {
      // console.log(id);
      // 根据id查询用户信息
      const { data: res } = await this.$http.get('users/' + id)
      // 查询失败
      if (res.meta.status !== 200) {
        return this.$message.error('查询用户信息失败')
      }
      // 查询成功 将信息保存到私有数据中
      this.editForm = res.data
      //   弹出对话框
      this.editDialogVisible = true
    },
    // 监听修改用户对话框的关闭事件
    editDialogClosed() {
      // 重置表单
      this.$refs.editFormRef.resetFields()
    },
    // 用户修改信息并提交
    editUserInfo() {
      // 预验证 用户修改信息的值
      this.$refs.editFormRef.validate(async (valid) => {
        //   console.log(valid);
        if (!valid) return
        // 发送请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )
        // 判断是否更新成功
        if (res.meta.status !== 200) {
          // 更新失败
          return this.$message.error('更新用户信息失败')
        }
        // 更新成功
        // 关闭对话框
        this.editDialogVisible = false
        // 重新获取数据
        this.getUserList()
        // 提示信息
        this.$message.success('更新用户信息成功')
      })
    },
    // 点击按钮弹出对话框 删除用户数据
    async removeUserById(id) {
      // console.log(id);
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
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

      const { data: res } = await this.$http.delete('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败')
      }
      this.$message.success('删除用户成功')
      // 重新获取数据
      this.getUserList()
    },
    // 打开分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo
      // 获取所有角色的列表
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) {
        return this.$message.error('获取角色列表失败!')
      }
      this.rolesList = res.data
      this.setRoleDialogVisble = true
    },
    // 点击确认按钮 分配所选中的角色
    async saveRoleInfo() {
      // 判断用户是否选择了数据
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('更新角色失败')
      }
      this.$message.success('更新角色成功')
      this.getUserList()
      this.setRoleDialogVisble = false
    },
    // 监听角色对话框的关闭事件 目的: 重置数据 是表单变成初始状态
    setRoleDialogClosed(){
      this.selectedRoleId= ''
      this.userInfo=''
    }
  },
  // 生命周期函数
  created() {
    this.getUserList()
  },
}
</script>
<style lang="less" scoped>
</style>