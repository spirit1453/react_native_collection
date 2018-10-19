import {
  NetInfo
} from 'react-native'
import {Toast} from 'native-base'
import EventTarget from './EventTarget'
const {FuncUtil} = require('@ys/vanilla')
const {runFunc} = FuncUtil

class NetInfoUtil extends EventTarget {
  static get online () {
    return NetInfoUtil.online
  }
  static init () {
    NetInfo.addEventListener('connectionChange', (connectionInfo) => {
      const {type} = connectionInfo
      if (type === 'none' || type === 'unknown') {
        NetInfoUtil.online = false
        NetInfoUtil.fire('offline')
      } else {
        NetInfoUtil.online = true
        NetInfoUtil.fire('online')
      }
    }
    )
  }

  static async httpPost ({offlineCb, url, param}) {
    let result
    if (NetInfoUtil.online) {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(param)
      })
      result = response.json()
    } else {
      runFunc(offlineCb)
      Toast.show({
        text: '无法连接网络,请检查网络设置',
        position: 'top',
        duration: 5000
      })
    }
    return result
  }
}

NetInfoUtil.init()

module.exports = NetInfoUtil
