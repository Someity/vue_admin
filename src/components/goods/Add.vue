<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 上方提示条 -->
      <el-alert
        title="
        添加商品信息"
        type="info"
        show-icon
        center
        :closable="false"
      >
      </el-alert>
      <!-- ------------------步骤条 ------------------->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- -------------------tab 栏区域 ----------------->

      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <!-- 参数解释 -->
          <!-- tab栏选项位置 -->
          <!--  tab栏当前显示的页面-->
          <!--  tab 栏 标签页发生变化是触发 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。-->
          <!--  tab 被选中时触发-->
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="{
                  expandTrigger: 'hover',
                  label: 'cat_name',
                  value: 'cat_id',
                  children: 'children',
                }"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品动态参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in manyTableData"
              :key="item.attr_id"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  :label="cb"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品静态属性 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in onlyTableData"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片参数 -->
          <el-tab-pane label="商品图片" name="3">
            <el-upload
              :action="uploadURl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <!-- 参数解释 -->
              <!-- 图片上传接口 action-->
              <!--  点击上传成功的图片触发此事件 （预览效果-->
              <!-- 删除图片时调用 -->
              <!-- 组件UI效果 -->
              <!-- 发送参数需要的请求头token 应为此组件没有通过axios发送请求 -->
              <!-- 文件上传成功触发此钩子 -->
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- 商品内容 -->
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <!-- 添加商品的按钮 -->
            <el-button class="btnAdd" type="primary" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="previewVisible" width="50%">
      <img class="previewImg" :src="previewPath" alt="" />
    </el-dialog>
  </div>
</template>
<script>
import _ from 'lodash'
export default {
  data() {
    return {
      // 步骤栏和tab栏区域连动数据
      activeIndex: '0',
      //  添加商品的表单数据
      addForm: {
        //   商品名称
        goods_name: '',
        // 商品价格
        goods_price: 0,
        // 商品重量
        goods_weight: 0,
        // 商品数量
        goods_number: 0,
        // 商品分类(提交时需要转换为以','分割的分类列表)
        goods_cat: [],
        // 上传的图片临时路径（对象）
        pics: [],
        // 商品详情描述
        goods_introduce: '',
        // 商品参数(动态参数和静态属性)
        attrs: [],
      },
      // 添加商品表单的验证规则
      addFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
      // 商品分类数据
      catelist: [],
      // 商品动态参数列表
      manyTableData: [],
      // 商品静态属性数据
      onlyTableData: [],
      // 图片上传地址
      uploadURl: 'http://127.0.0.1:8888/api/private/v1/upload',
      // 图片上传组件的请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
      // 图片预览的路径
      previewPath: '',
      // 控制图片预览对话框的显示与隐藏
      previewVisible: false,
    }
  },
  methods: {
    //   获取所有商品分类数据 （商品分类列表需要
    async getCateList() {
      const { data: res } = await this.$http.get('categories')

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }

      this.catelist = res.data
      //   console.log(this.catelist)
    },
    // 级联选择框发生变化触发（商品分类列表需要 只能选中三级选项
    handleChange() {
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = []
      }
    },
    // tab 栏 标签页发生变化是触发 根据条件判断标签页是否切换
    beforeTabLeave(activeName, oldActiveName) {
      // console.log(activeName); 即将进去的标签页名字
      // console.log(oldActiveName);即将离开的标签页名字
      if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类！')
        return false
      }
    },
    // tab 被选中时触发
    async tabClicked() {
      // 访问动态参数面板
      if (this.activeIndex == '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'many' },
          }
        )
        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败！')
        }

        console.log(res.data)
        //  将获取到的商品参数通过循环将字符串变成数组形式
        res.data.forEach((item) => {
          // 用三元表达式判断是否为空字符串
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })
        this.manyTableData = res.data
      } else if (this.activeIndex == '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          {
            params: { sel: 'only' },
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取静态参数列表失败！')
        }

        console.log(res.data)
        this.onlyTableData = res.data
      }
    },
    //  图片预览效果
    handlePreview(file) {
      console.log(file)
      this.previewPath = file.response.data.url
      this.previewVisible = true
    },
    // 处理商品图片移除效果
    handleRemove(file) {
      // console.log(file)
      // 1. 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path
      // 2. 从 pics 数组中，找到这个图片对应的索引值
      const i = this.addForm.pics.findIndex((x) => x.pic === filePath)
      // 3. 调用数组的 splice 方法，把图片信息对象，从 pics 数组中移除
      this.addForm.pics.splice(i, 1)
      console.log(this.addForm)
    },
    // 监听文件上传成功
    handleSuccess(response) {
      console.log(response)
      // 1. 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 2. 将图片信息对象，push 到pics数组中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async valid => {
        if (!valid) {
          return this.$message.error('请添加必要的表单项')
        }
        //  预校验成功 执行添加的业务逻辑
        // lodash依赖   cloneDeep(obj)深拷贝方法
        const form = _.cloneDeep(this.addForm)
        form.goods_cat = form.goods_cat.join(',')
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' '),
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = { 
              attr_id: item.attr_id, 
              attr_value: item.attr_vals 
              }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
          // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
        if (res.meta.status !== 201) {
          return this.$message.error(res.meta.msg)
        }
        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      })
    },
  },
  //   生命周期
  created() {
    this.getCateList()
  },
  //   计算属性
  computed: {
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      }
      return null
    },
  },
}
</script>
<style lang="less" scoped>
// 复选框样式优化
.el-checkbox {
  margin: 0 15px 0 0 !important;
}
.previewImg {
  width: 100%;
}
.btnAdd {
  margin-top: 15px;
}
</style>