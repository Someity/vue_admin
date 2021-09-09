<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/logo.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!--侧边栏区域 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
          <!-- 顶部按钮条 -->
          <div class="toggle-button" @click="toggleCollapse">|||||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          router
          :default-active="activePath"
        >
          <!-- 鼠标点击的颜色active-text-colo -->
          <!-- 只允许一个菜单展开 unique-opened -->
          <!-- 折叠或者展开 :collapse="isCollapse"-->
          <!-- 关闭折叠动画 :collapse-transition="false" -->
          <!-- 开启路由模式 router -->
          <!-- 一级菜单开始 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item  in menulist"
            :key="item.id"
            
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 字体图标 -->
              <i :class="icionObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+subItem.path"
              v-for="subItem in item.children"
              :key="subItem.id"
              @click="saveNavState('/'+subItem.path)"
              
            >
            <!-- 跳转地址 :index="'/'+subItem.path"-->
              <!-- 二级菜单模板区域 -->
              <template slot="title">
                <!-- 字体图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{ subItem.authName }}</span>
              </template>
            </el-menu-item>
            <!-- 一级菜单结束 -->
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体区域 -->
      <el-main>
          <!-- 路由占位符 -->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template> 

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],
      // 一级菜单的字体图标
      icionObj:{
          '125':'iconfont icon-users',
          '103':'iconfont icon-tijikongjian',
          '101':'iconfont icon-shangpin',
          '102':'iconfont icon-danju',
          '145':'iconfont icon-baobiao',
      },
      // 是否折叠
      isCollapse:false,
      // 激活链接地址
      activePath:''
    }
  },
  // 生命周期函数
  created() {
    this.getMenuList()
   this.activePath = window.sessionStorage.getItem('activePath')
  },
  methods: {
    //   退出方法
    logout() {
      // 清除sessionStorage
      window.sessionStorage.clear()
      // 导航到login页面
      this.$router.push('/login')
    },
    // 获取所有左侧菜单
    async getMenuList() {
      // 发送get请求 并结构赋值出来返回的值
      const { data: res } = await this.$http.get('menus')
      // 判断 状态码是否 == 200 否:返回错误信息 是 : 向下执行
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
      //    将列表数据赋值给上方定义的数据

      this.menulist = res.data
      this.menulist.splice(this.menulist.length-1,1)
     // console.log(res)
    },
    // 点击按钮折叠与展开菜单
    toggleCollapse(){
        this.isCollapse = !this.isCollapse
    },
    // 保存链接激活状态
    saveNavState(activePath) {
        window.sessionStorage.setItem('activePath',activePath)
       this.activePath = activePath

    }
  },
}
</script>
<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
    img {
      height: 60px;
      background-color: #fff;
      border-radius: 50%;
    }
  }
}
.el-aside {
  background-color: #333744;
  .el-menu {
    //   右侧边框线优化
      border-right: none;
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
    margin-right: 10px;
}
.toggle-button{
    background-color: #4a5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    // 字体间距
    letter-spacing: 0.2em;
    // 鼠标样式 小手
    cursor: pointer;
}
</style>