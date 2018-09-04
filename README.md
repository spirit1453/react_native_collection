
### 安装
 npm i https://github.com/spirit1453/hfs.git#publish

 npm版本过高可能报错,使用yarn安装

 yarn add https://github.com/spirit1453/hfs.git#publish --save

### 使用
1. 先要安装 react-native-camera ,再
```
            react-native link react-native-camera
```
2. 引入ScanView
````
const {ScanView} = require('@hfs/react-native-collection')
````
 stack navigator 里面注册 ScanView

3. 配置android震动权限

在AndroidManifest.xml中添加
```xml
<uses-permission android:name="android.permission.VIBRATE"/>
```
权限

### API调用
```
    this.props.navigation.navigate("ScanView",{
               onRead:this.onRead,
               noVibrate:false
           })
```
navigate传入的2个参数,
 * onRead:函数
 ```
 ( event ) => {
        const {data} = event
        //data 即时扫描二维码结果
 }
 ```

 * noVibrate: 默认为false,扫码识别之后设备是否震动


