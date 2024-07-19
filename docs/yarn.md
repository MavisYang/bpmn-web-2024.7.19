yarn和npm的区别?

Yarn和npm都是JavaScript的包管理器，但它们在某些方面有所不同：

性能和速度
Yarn通常在性能上比npm更快，这主要是因为Yarn使用了并行下载和缓存机制，能有效利用网络带宽。

安装算法
npm使用的是深度优先的安装算法，这意味着它会首先安装依赖的依赖，然后再安装当前项目所需的依赖。而Yarn使用的是扁平化的安装算法，它将所有依赖包都安装到项目的根目录下，这避免了多个版本的依赖包冲突。

锁定文件
Yarn提供了一个锁定文件(yarn.lock)，自动记录确切的包版本信息，以确保每次安装时都能获得相同版本的依赖包，减少构建过程中的不确定性。而npm则通过npm-shrinkwrap.json文件来实现类似的功能，但需要开发者手动执行命令生成这个文件。

用户界面
Yarn提供了一个简洁且易于理解的命令行界面，显示实时的进度条和更详细的错误信息。相比之下，npm的用户界面虽然也在最新版本中得到改进，但仍然相对简单。

离线模式
如果用户之前已经安装过一个包，使用Yarn再次安装时可以从缓存中获取，从而避免再次从网络下载。而npm则会从网络重新下载包。
多注册来源处理。Yarn默认只从一个注册来源安装包，无论是npm还是其他源，防止出现混乱不一致的情况。

更好的语义化。
Yarn改变了一些npm命令的名称，使其更加直观和清晰，例如使用yarn add/remove代替npm install/uninstall。

总的来说，Yarn旨在解决npm在使用过程中遇到的一些问题，如依赖安装的速度和一致性，同时提供更好的用户体验。


安装yarn 
npm install -g yarn
安装成功后，查看版本号： 
yarn --version
创建文件夹 yarn 
md yarn
进入yarn文件夹 
cd yarn
初始化项目 
yarn init // 同npm init，执行输入信息后，会生成package.json文件
yarn的配置项： 
yarn config list // 显示所有配置项
yarn config get <key> //显示某配置项
yarn config delete <key> //删除某配置项
yarn config set <key> <value> [-g|--global] //设置配置项
安装包： 
yarn install //安装package.json里所有包，并将包及它的所有依赖项保存进yarn.lock
yarn install --flat //安装一个包的单一版本
yarn install --force //强制重新下载所有包
yarn install --production //只安装dependencies里的包
yarn install --no-lockfile //不读取或生成yarn.lock
yarn install --pure-lockfile //不生成yarn.lock
添加包（会更新package.json和yarn.lock）：

yarn add [package] // 在当前的项目中添加一个依赖包，会自动更新到package.json和yarn.lock文件中
yarn add [package]@[version] // 安装指定版本，这里指的是主要版本，如果需要精确到小版本，使用-E参数
yarn add [package]@[tag] // 安装某个tag（比如beta,next或者latest）
//不指定依赖类型默认安装到dependencies里，你也可以指定依赖类型：

yarn add --dev/-D // 加到 devDependencies
yarn add --peer/-P // 加到 peerDependencies
yarn add --optional/-O // 加到 optionalDependencies
//默认安装包的主要版本里的最新版本，下面两个命令可以指定版本：

yarn add --exact/-E // 安装包的精确版本。例如yarn add foo@1.2.3会接受1.9.1版，但是yarn add foo@1.2.3 --exact只会接受1.2.3版
yarn add --tilde/-T // 安装包的次要版本里的最新版。例如yarn add foo@1.2.3 --tilde会接受1.2.9，但不接受1.3.0
发布包

yarn publish
移除一个包 
yarn remove <packageName>：移除一个包，会自动更新package.json和yarn.lock
更新一个依赖 
yarn upgrade 用于更新包到基于规范范围的最新版本
运行脚本 
yarn run 用来执行在 package.json 中 scripts 属性下定义的脚本
显示某个包的信息 
yarn info <packageName> 可以用来查看某个模块的最新版本信息
缓存 
yarn cache 
yarn cache list # 列出已缓存的每个包 
yarn cache dir # 返回 全局缓存位置 
yarn cache clean # 清除缓存
