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
      try {
        const paramStringify = JSON.stringify(param)
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: paramStringify
        })
        result = await response.json()

      } catch( error) {
        console.error(`Post ${url} with param ${paramStringify} fail 1`)
        console.error(error)
      }

    } else {
      runFunc(offlineCb)
    }
    return result
  }
}

NetInfoUtil.init()

module.exports = NetInfoUtil
