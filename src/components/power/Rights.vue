<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
        <el-table :data="rightsList" border stripe>
            <el-table-column type="index"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <!-- 模板插槽   slot-scope="scope" 可以获取当前模板中的数据-->
                <template slot-scope="scope">
                    <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                    <el-tag v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
                    <el-tag v-else type="warning">三级</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
  </div>
</template>
<script>
export default {
  data() {
    return {
      // 存储获取的权限列表
      rightsList: [],
    }
  },
  created() {
    //  当页面载入完成 获取权限列表
    this.getRightsList()
  },
  methods: {
    //   获取权限列表
    async getRightsList() {
      // 发送get请求获取权限列表
      const { data: res } = await this.$http.get('rights/list')
      // 对这次请求进行判断
      if (res.meta.status !== 200) {
        // 请求失败
        return this.$message.error('获取权限列表失败')
      }
      // 请求成功 将数据赋值给此页面的私有数据
      this.rightsList = res.data
     // console.log(this.rightsList)
    },
  },
}
</script>
<style lang="less" scoped>
</style>