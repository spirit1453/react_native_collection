import {Alert} from 'react-native'
const {FuncUtil} = require('@ys/vanilla')
const {runFunc} = FuncUtil
const errorMsgSet = new Set()
let resetTimeDefault = 1000 * 60

class ErrorStock {
  constructor (resetTime = resetTimeDefault) {
    this.errorMsgSet = new Set()
    function f () {
      errorMsgSet.clear()
      setTimeout(f, resetTime)
    }
    f()
  }

  func (msg, innerFunc) {
    if (!this.errorMsgSet.has(msg)) {
      this.errorMsgSet.add(msg)
      runFunc(innerFunc)
    }
  }

  processError ({error, devProcess, productionProcess}) {
    const msg = error.toString()

    if (__DEV__) {
      if (devProcess) {
        devProcess()
      } else {
        this.func(msg, () => {
          Alert.alert(msg)
          console.log(error)
        })
      }
    } else {
      this.func(msg, productionProcess)
    }
  }
}

module.exports = ErrorStock
