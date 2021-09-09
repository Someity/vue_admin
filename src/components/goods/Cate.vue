<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 行 -->
      <el-row>
        <!-- 列 -->
        <el-col>
          <el-button type="primary" @click="showAddCateDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <!-- 表格 -->
      <tree-table
        :data="catelist"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        :show-row-hover="false"
        class="treeTable"
      >
        <!-- 参数解释 -->
        <!-- 表格的所有数据 -->
        <!-- 表格数据显示规则 -->
        <!-- 关闭多选框-->
        <!-- 关闭展开表格功能 -->
        <!-- 添加索引列 -->
        <!-- 索引列表头名称 -->
        <!-- 添加边框线 -->
        <!-- 关闭鼠标变色功能 -->
        <!-- css样式 上边距 10px -->
        <!-- --------是否有效 --------- -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-success"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-error" v-else style="color: red"></i>
        </template>
        <!-- --------排序 --------- -->
        <template slot="order" slot-scope="scope">
          <!-- 按需导入 -->
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <!-- --------操作 --------- -->
        <template slot="opt" slot-scope="scope">
          <!-- 按需导入 -->
          <el-button
            size="mini"
            type="primary"
            icon="el-icon-edit"
            @click="showEditDialog(scope.row.cat_id)"
            >编辑</el-button
          >
          <el-button
            size="mini"
            type="danger"
            icon="el-icon-delete"
            @click="removeCateById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="querInfo.pagenum"
        :page-sizes="[3, 5, 10, 15]"
        :page-size="querInfo.pagesize"
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
    </el-card>
    <!-- --------------添加分类对话框 --------------->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClosed"
    >
      <!-- 添加分类表单组件 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类">
          <el-cascader
            v-model="selectedKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
            }"
            @change="parentCateChanged"
            clearable
            change-on-select
          >
            <!-- 参数解释 -->
            <!--  当前选中的数据-->
            <!-- 当前要展示的数据源 -->
            <!-- 指定的配置对象
                expandTrigger ：次级菜单的展开方式
                value ：指定选项的值为选项对象的某个属性值
                label ： 指定选项标签为选项对象的某个属性值
                children ： 指定选项的子选项为选项对象的某个属性值
           -->
            <!-- 选择器发生变化触发这个方法 -->
            <!-- 添加清空选项 -->
            <!-- 添加一级列表选择（圆点选择是这个功能 -->
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- ------------编辑分类的对话框------------ -->
    <el-dialog
      title="编辑分类"
      :visible.sync="deitCateDialogVisible"
      width="50%"
      @close="deitCateDialogClosed"
    >
      <!-- 添加分类表单组件 -->
      <el-form
        :model="deitCateForm"
        :rules="deitCateFormRules"
        ref="deitCateFormRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="deitCateForm.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="deitCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deitCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 商品分类的查询条件 (get 路由的参数)
      querInfo: {
        // 查询所有类别
        type: 3,
        // 当前页数
        pagenum: 1,
        // 每页显示的数据
        pagesize: 5,
      },
      //  --------- 商品分类 -----------
      // 商品分类总数据列表
      catelist: [],
      // 总数据条数
      total: null,
      // 为table指定列的定义
      columns: [
        //   分类名称
        {
          // 当前列的标题
          label: '分类名称',
          // 当前列的属性值
          prop: 'cat_name',
        },
        // 是否有效
        {
          label: '是否有效',
          //  表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'isok',
        },
        // 排序
        {
          label: '排序',
          //  表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'order',
        },
        // 操作
        {
          label: '操作',
          //  表示将当前列定义为模板列
          type: 'template',
          // 表示当前这一列使用的模板名称
          template: 'opt',
        },
      ],
      //  控制添加分类对话框的显示与隐藏
      addCateDialogVisible: false,
      // 添加分类的表单对象
      addCateForm: {
        // 将要添加的名称
        cat_name: '',
        //   分类父 ID
        cat_pid: 0,
        //   分类层级 默认添加一级分类
        cat_level: 0,
      },
      // 添加分类表单的验证规则对象
      addCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
      // 级联选择框要展示的父级分类的列表
      parentCateList: [],
      // 当前要添加的分类数据
      selectedKeys: [],
      //   -------------编辑分类--------
      // 编辑分类面板的显示与隐藏
      deitCateDialogVisible: false,
      // 编辑分类的表单数据
      deitCateForm: {},
      // 编辑分类的表单验证规则
      deitCateFormRules: {
        cat_name: [
          { required: true, message: '请输入分类名称', trigger: 'blur' },
        ],
      },
    }
  },
  created() {
    this.getCateList()
  },
  methods: {
    // 获取商品分类总数据列表
    async getCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.querInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message('获取商品分类失败')
      }

      console.log(res.data);
      // 将数据列表赋值
      this.catelist = res.data.result
      // 为总数据条数赋值
      this.total = res.data.total
    },
    // 监听pageesize(当前页的数据) 改变
    handleSizeChange(newSize) {
      // 赋值最新的数据
      this.querInfo.pagesize = newSize
      // 重新获取数据
      this.getCateList()
    },
    // 监听pagenum (当前页数）事件
    handleCurrentChange(newPage) {
      // 赋值最新的数据
      this.querInfo.pagenum = newPage
      // 重新获取数据
      this.getCateList()
    },
    // 点击按钮展示添加分类的对话框
    showAddCateDialog() {
      // 再打开对话框之前获取父级分类的数据
      this.getParentCateList()
      this.addCateDialogVisible = true
    },
    // 获取父级分类的数据列表
    async getParentCateList() {
      const { data: res } = await this.$http.get('categories', {
        params: { type: 2 },
      })

      if (res.meta.status !== 200) {
        return this.$message.error('获取父级分类数据失败')
      }

      // console.log(res.data);
      this.parentCateList = res.data
    },
    // 选择器发生变化出发这个函数
    parentCateChanged() {
      // 如果 this.selectedKeys.length（当前选中的数据的长度 > 0 说明选中了父级分类

      if (this.selectedKeys.length > 0) {
        // 赋值给父级分类的id
        this.addCateForm.cat_pid = this.selectedKeys[
          this.selectedKeys.length - 1
        ]
        // 赋值给当前分类等级
        this.addCateForm.cat_level = this.selectedKeys.length
        // console.log(this.selectedKeys);
        return
      } else {
        this.addCateForm.cat_pid = 0
        this.addCateForm.cat_level = 0
      }
    },
    // 点击按钮 添加新的分类
    addCate() {
      // 预校验
      this.$refs.addCateFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post(
          'categories',
          this.addCateForm
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加分类失败')
        }

        this.$message.success('添加分类成功')

        this.getCateList()

        this.addCateDialogVisible = false
      })
    },
    // 监听添加分类对话框关闭事件 重置表单
    addCateDialogClosed() {
      this.$refs.addCateFormRef.resetFields()
      this.selectedKeys = []
      this.addCateForm.cat_pid = 0
      this.addCateForm.cat_level = 0
    },
    // 监听编辑分类对话框关闭事件 重置表单
    deitCateDialogClosed() {
      this.$refs.deitCateFormRef.resetFields()
    },
    // 点击编辑分类对话框确认按钮
    deitCate() {
      // 预验证 用户修改信息的值
      this.$refs.deitCateFormRef.validate(async (valid) => {
        //   console.log(valid);
        if (!valid) return
        // 发送请求

        const { data: res } = await this.$http.put(
          'categories/' + this.deitCateForm.cat_id,
          {
            cat_name: this.deitCateForm.cat_name,
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('更新数据失败')
        }

        // 重新获取数据
        this.getCateList()
        this.$message.success('更新数据成功')

        this.deitCateDialogVisible = false
      })
    },
    // 点击编辑按钮 (查询数据并赋值 打开对话框)
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品分类信息失败')
      }
      this.deitCateForm = res.data
      // console.log(this.deitCateForm);
      this.deitCateDialogVisible = true
    },
    // 点击按钮删除分类
    async removeCateById(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该分类, 是否继续?',
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
      const { data: res } = await this.$http.delete('categories/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除分类失败')
      }
      this.$message.success('删除分类成功')
      // 重新获取数据
      this.getCateList()
    },
  },
}
</script>
<style lang="less" scoped>
.treeTable {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>