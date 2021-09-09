import Vue from 'vue'
import App from './App.vue'
import router from './router'
// element-ui
import './plugins/element.js'
// 全局样式表
import './assets/css/global.css'
// 字体图标(阿里)
import './assets/fonts/iconfont.css'
// 导入axios插件
import axios from 'axios'
// 导入表格插件
import TreeTable from 'vue-table-with-tree-grid'
//  导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

// 导入 NProgress顶部进度条插件
import NProgress from 'nprogress'
//  进度条样式
import 'nprogress/nprogress.css'

// 配置请求的根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
    // 设置request请求拦截器 1、展示进度条NProgress.start() 2、为所有请求头添加`token` 
axios.interceptors.request.use(config => {
    // console.log(config);
    // 1、 展示进度条
    NProgress.start()
        // 2、为所有请求头添加`token`
    config.headers.Authorization = window.sessionStorage.getItem('token')
    return config
});
// 设置response 相应拦截器 结束进度条展示
axios.interceptors.response.use(config => {
        // 进度条结束
        NProgress.done()
        return config

    })
    // 全局挂载axios
Vue.prototype.$http = axios
    // 阻止启动生产消息，
Vue.config.productionTip = false
    // 全局注册
Vue.component('tree-table', TreeTable)
    // 将富文本编辑器注册为全局可用的组件
Vue.use(VueQuillEditor)
    //  时间过滤器
Vue.filter('dateFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
    router,
    render: h => h(App)
}).$mount('#app')