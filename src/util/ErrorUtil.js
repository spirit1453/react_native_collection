import {Alert} from 'react-native'
const ErrorUtilRN = require('ErrorUtils')
const {FuncUtil} = require('@ys/vanilla')
const {runFunc} = FuncUtil
const errorMsgSet = new Set()
let resetTimeDefault = 1000 * 60

function f () {
  errorMsgSet.clear()
  setTimeout(f, resetTimeDefault)
}

f()

class ErrorUtil {
  static processError ({devProcess, productionProcess, resetTime}) {
    if (resetTime) {
      resetTimeDefault = resetTime
    }
    const func = (msg, innerFunc) => {
      if (!errorMsgSet.has(msg)) {
        errorMsgSet.add(msg)
        runFunc(innerFunc)
      }
    }
    ErrorUtilRN.setGlobalHandler((error) => {
      const msg = error.toString()

      if (__DEV__) {
        if (devProcess) {
          devProcess()
        } else {
          func(msg, () => {
            Alert.alert(msg)
            console.log(error)
          })
        }
      } else {
        func(msg, productionProcess)
      }
    })
  }
  static init () {
    console.ignoredYellowBox = ['Setting a timer', 'Remote debugger']
  }
}
ErrorUtil.init()

Object.freeze(ErrorUtil)
module.exports = ErrorUtil
