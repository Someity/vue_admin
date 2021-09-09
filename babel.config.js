// 项目发布阶段需要用的babel插件
const prodPlugins = []
    // 判断是否执行发布的命令
if (process.env.NODE_ENV === 'prodection') {
    prodPlugins.push('transform-remove-console')
}

module.exports = {
    presets: [
        '@vue/cli-plugin-babel/preset'
    ],
    plugins: [
        [
            'component',
            {
                libraryName: 'element-ui',
                styleLibraryName: 'theme-chalk'
            }
        ],
        // 发布项目时候所需要的插件 （移除所有console  ||  ...展开运算符
        ...prodPlugins,
        // 路由懒加载
        '@babel/plugin-syntax-dynamic-import'

    ]
}