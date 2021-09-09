// webpack 自定义配置对象
module.exports = {
    chainWebpack: config => {
        // 发布模式
        config.when(process.env.NODE_ENV === 'production', config => {
                // 设置不同的打包地址

                config.entry('app').clear().add('./src/main-prod.js')

                // 1、通过 externals 加载外部 CDN 资源
                config.set('externals', {
                        vue: 'Vue',
                        'vue-router': 'VueRouter',
                        axios: 'axios',
                        lodash: '_',
                        echarts: 'echarts',
                        nprogress: 'NProgress',
                        'vue-quill-editor': 'VueQuillEditor'
                    })
                    // 根据开发模式来设置不同的title
                config.plugin('html').tap(args => {
                    args[0].isProd = true
                    return args
                })

            })
            // 开发模式
        config.when(process.env.NODE_ENV === 'development', config => {
            // 设置不同的打包地址

            config.entry('app').clear().add('./src/main-dev.js')
                // 根据开发模式来设置不同的title

            config.plugin('html').tap(args => {
                args[0].isProd = false
                return args
            })

        })
    }

}