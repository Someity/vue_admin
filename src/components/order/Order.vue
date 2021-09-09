<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片试图 -->
    <el-card>
      <!-- 搜索框 -->
      <el-row>
        <el-col :span="8">
          <el-input 
          placeholder="请输入内容"
          v-model="qeuryInfo.query"
          clearable
          @clear="getOrderList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrderList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 订单列表数据 -->
      <el-table :data="orderList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="订单编号" prop="order_number"></el-table-column>
        <el-table-column label="订单价格" prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.pay_status === '1'" type="success"
              >已付款</el-tag
            >
            <el-tag v-else type="danger">未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="订单是否发货" prop="is_send"></el-table-column>
        <el-table-column label="下单时间">
          <template slot-scope="scope">
            {{ scope.row.create_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <!-- 编辑地址 -->
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              @click="showBox"
            ></el-button>
            <!-- 物流进度按钮 -->
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location"
              @click="showProgressBox"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="qeuryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="qeuryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog
      title="修改地址"
      :visible.sync="addressVisible"
      width="50%"
      @close="addressDialogClosed"
    >
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <!-- 省市县联动框 -->
          <el-cascader
            :options="cityData"
            v-model="addressForm.address1"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 物流进度对话框 -->
    <el-dialog title="物流进度" :visible.sync="progressVisible" width="50%">
      <!-- 物流时间线 itmeline -->
      <el-timeline>
        <el-timeline-item
          v-for="(activity, index) in progressInfo"
          :key="index"
          :timestamp="activity.time"
        >
          {{ activity.context }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>
<script>
import cityData from './citydata.js'
export default {
  data() {
    return {
      // 查询对象
      qeuryInfo: {
        //   查询参数
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
      },
      // 总数据条数
      total: null,
      //   获取到的 订单列表
      orderList: [],
      // 控制修改地址对话框的显示与隐藏
      addressVisible: false,
      //   修改地址对话框的表单数据
      addressForm: {
        address1: [],
        address2: '',
      },
      // 修改地址对话框的表单验证规则
      addressFormRules: {
        address1: [
          { required: true, message: '请选择省市区县', trigger: 'blur' },
        ],
        address2: [
          { required: true, message: '请填写详细地址', trigger: 'blur' },
        ],
      },
      //  省市区县数据
      cityData,
      // 控制物流进度对话框的显示与隐藏
      progressVisible: false,
      //   物流信息
      progressInfo: [],
    }
  },
  methods: {
    //   获取订单数据
    async getOrderList() {
      const { data: res } = await this.$http.get('orders', {
        params: this.qeuryInfo,
      })
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      // console.log(res)
      this.total = res.data.total
      this.orderList = res.data.goods
    },
    //  监听每页显示的数据条数 pagesize 发生变化 返回最新的数据条数
    handleSizeChange(newSize) {
      this.qeuryInfo.pagesize = newSize
      this.getOrderList()
    },
    //  监听当页显示的页码数 pagenum发生变化时触发 返回最新的页码数
    handleCurrentChange(newPage) {
      this.qeuryInfo.pagenum = newPage
      this.getOrderList()
    },
    // 操作的修改地址按钮
    showBox() {
      this.addressVisible = true
    },
    //  监听修改地址对话框关闭事件 清空表单数据
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    // 物流进度按钮
    async showProgressBox() {
      const { data: res } = await this.$http.get(
        'https://www.liulongbin.top:8888/api/private/v1/kuaidi/1106975712662'
      )

      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }

      this.progressInfo = res.data

      console.log(this.progressInfo)

      this.progressVisible = true
    },
  },
  //   生命周期
  created() {
    this.getOrderList()
  },
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>