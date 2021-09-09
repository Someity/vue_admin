<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!--  搜索框 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="gitGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="gitGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <!-- 添加商品 按钮 -->
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 表格数据 -->
      <el-table :data="goodslist" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <!-- 商品名称 -->
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <!-- 商品价格 -->
        <el-table-column
          width="95px"
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <!-- 商品数量 -->
        <el-table-column
          width="95px"
          label="商品数量"
          prop="goods_number"
        ></el-table-column>
        <!-- 商品重量 -->
        <el-table-column
          width="70px"
          label="商品重量"
          prop="goods_weight"
        ></el-table-column>
        <!-- 商品时间 -->
        <el-table-column width="140px" label="创建时间">
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column width="130px" label="操作">
          <template slot-scope="scope">
            <!-- 编辑按钮 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.goods_id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeByid(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        background
      >
      </el-pagination>
    </el-card>
    <!-- ------------编辑分类的对话框------------ -->
    <el-dialog
      title="编辑商品"
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
        <el-form-item label="商品名称" prop="goods_name">
          <el-input type="textarea"  v-model="deitCateForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goods_price">
          <el-input type="number" v-model="deitCateForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="数量" prop="goods_number">
          <el-input type="number" v-model="deitCateForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="重量" prop="goods_weight">
          <el-input type="number" v-model="deitCateForm.goods_weight"></el-input>
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
      // 分页功能的请求参数对象
      queryInfo: {
        query: '',
        pagenum: 1,
        pagesize: 10,
      },
      // 获取的商品列表
      goodslist: [],
      // 商品的总数据条数
      total: null,
      // 编辑对话框的显示与隐藏
      deitCateDialogVisible: false,
      // 编辑对话框需要的数据
      deitCateForm: {},
      // 编辑对话框的表单验证规则
      deitCateFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    // 获取对应的商品列表
    async gitGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }
      // this.$message.success('获取商品列表成功')
      console.log(res.data)
      this.goodslist = res.data.goods
      this.total = res.data.total
    },
    //当前页显示显示的数据
    handleSizeChange(newSize) {
      this.queryInfo.pagesize = newSize
      this.gitGoodsList()
    },
    //  当前是第几页
    handleCurrentChange(newPage) {
      this.queryInfo.pagenum = newPage
      this.gitGoodsList()
    },
    // 根据id删除商品
    async removeByid(id) {
      const confirmResult = await this.$confirm(
        '此操作将永久删除该商品, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已经取消删除')
      }

      const { data: res } = await this.$http.delete('goods/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败')
      }
      this.$message.success('删除商品成功')
      this.gitGoodsList()
    },
    // 跳转到添加商品 列表
    goAddpage() {
      this.$router.push('/goods/add')
    },
    // 重置 编辑分类表单对话框
    deitCateDialogClosed() {
      this.$refs.deitCateFormRef.resetFields()
    },
    // 根据ID编辑商品 获取数据并保存到私有数据中打开对话框
   async showEditDialog(id) {
      const { data: res } = await this.$http.get('goods/' + id)
      if (res.meta.status !== 200) {
        console.log(res);
        return this.$message.error('获取商品信息失败')
      }
      
      this.deitCateForm = res.data
      console.log(this.deitCateForm);
      this.deitCateDialogVisible = true
    },
    // 点击确认按钮 将编辑后的信息发送请求提交到数据库中并重新获取页面数据
    deitCate(){
 // 预验证 用户修改信息的值
      this.$refs.deitCateFormRef.validate(async valid => {
        //   console.log(valid);
        if (!valid) return
        // 发送请求

        const { data: res } = await this.$http.put(
          'goods/' + this.deitCateForm.goods_id,
          {
            goods_name: this.deitCateForm.goods_name,
            goods_price: this.deitCateForm.goods_price,
            goods_number: this.deitCateForm.goods_number,
            goods_weight: this.deitCateForm.goods_weight,
          }
        )
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }

        // 重新获取数据
        this.gitGoodsList()
        this.$message.success(res.meta.msg)

        this.deitCateDialogVisible = false
      })
    }
  },
  created() {
    this.gitGoodsList()
  },
}
</script>
<style lang="less" scoped>
</style>