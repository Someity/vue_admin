import Vue from 'vue'
import VueRouter from 'vue-router'


// 使用路由懒加载加载组件

// login_home_welcome
// import Login from '../components/login.vue'
const Login = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/login.vue')
    // import Home from '../components/home.vue'
const Home = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/home.vue')
    // import Welcome from '../components/Welcome.vue'
const Welcome = () =>
    import ( /* webpackChunkName: "login_home_welcome" */ '../components/Welcome.vue')

// "Users_Rights_Roles"
// import Users from '../components/user/Users.vue'
const Users = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/user/Users.vue')
    // import Rights from '../components/power/Rights.vue'
const Rights = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Rights.vue')
    // import Roles from '../components/power/Roles.vue'
const Roles = () =>
    import ( /* webpackChunkName: "Users_Rights_Roles" */ '../components/power/Roles.vue')


// Cate_Params
// import Cate from '../components/goods/Cate.vue'
const Cate = () =>
    import ( /* webpackChunkName: "Cate_Params" */ '../components/goods/Cate.vue')
    // import Params from '../components/goods/Params.vue'
const Params = () =>
    import ( /* webpackChunkName: "Cate_Params" */ '../components/goods/Params.vue')

// "List_Add"
// import List from '../components/goods/List.vue'
const List = () =>
    import ( /* webpackChunkName: "List_Add" */ '../components/goods/List.vue')
    // import Add from '../components/goods/Add.vue'
const Add = () =>
    import ( /* webpackChunkName: "List_Add"  */ '../components/goods/Add.vue')

0

// import Oredr from '../components/order/Order.vue'
const Oredr = () =>
    import ( /* webpackChunkName: "Oredr_Report" */ '../components/order/Order.vue')
    // import Report from '../components/report/Report.vue'
const Report = () =>
    import ( /* webpackChunkName: "Oredr_Report" */ '../components/report/Report.vue')
    // 安装插件
Vue.use(VueRouter)
    // 配置路由和组件之间的应用关系
const routes = [
        { path: '/', redirect: '/login' },
        { path: '/login', component: Login },
        {
            path: '/home',
            component: Home,
            // 重定向
            redirect: '/welcome',
            children: [{
                path: '/welcome',
                component: Welcome
            }, {
                path: '/users',
                component: Users
            }, {
                path: '/rights',
                component: Rights
            }, {
                path: '/roles',
                component: Roles
            }, {
                path: '/categories',
                component: Cate
            }, {
                path: '/params',
                component: Params
            }, {
                path: '/goods',
                component: List
            }, {
                path: '/goods/add',
                component: Add
            }, {
                path: '/orders',
                component: Oredr
            }, {
                path: '/reports',
                component: Report
            }]
        }
    ]
    // 创建路由对象
const router = new VueRouter({
    routes
});
// 为路由对象，添加 beforeEach 导航守卫
// to: Route: 即将要进入的目标 路由对象
// from: Route: 当前导航正要离开的路由
// next: Function: 一定要调用该方法来 resolve 这个钩子。
router.beforeEach((to, from, next) => {
        // 如果用户访问的登录页，直接放行 
        if (to.path === '/login') return next()
            // 从 sessionStorage 中获取到 保存的 token 值
        const tokenStr = window.sessionStorage.getItem('token')
            // 没有token，强制跳转到登录页
        if (!tokenStr) return next('/login')
        next()
    })
    //  将router 对象导出
export default router