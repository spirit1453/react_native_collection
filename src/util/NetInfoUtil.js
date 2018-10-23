import {
  NetInfo
} from 'react-native'
import {Toast} from 'native-base'
import EventTarget from './EventTarget'
const {FuncUtil} = require('@ys/vanilla')
const {runFunc} = FuncUtil

class NetInfoUtil extends EventTarget {
  static get online () {
    return NetInfoUtil.onlineState
  }
  static init () {
    NetInfo.addEventListener('connectionChange', (connectionInfo) => {
      const {type} = connectionInfo
      if (type === 'none' || type === 'unknown') {
        NetInfoUtil.onlineState = false
        NetInfoUtil.fire('offline')
      } else {
        NetInfoUtil.onlineState = true
        NetInfoUtil.fire('online')
      }
    }
    )
  }

  static async httpPost ({offlineCb, url, param}) {
    let result
    if (NetInfoUtil.onlineState) {
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
    }
    return result
  }
}

NetInfoUtil.init()

module.exports = NetInfoUtil
