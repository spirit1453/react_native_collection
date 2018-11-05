import {Alert} from 'react-native'
const {FuncUtil} = require('@ys/vanilla')
const {runFunc} = FuncUtil
const errorMsgSet = new Set()
let resetTimeDefault = 1000 * 60

class ErrorStock {
  constructor (resetTime = resetTimeDefault) {
    this.errorMsgSet = new Set()
    const f = () => {
      this.errorMsgSet.clear()
      setTimeout(f, resetTime)
    }
    f()
  }

  func (msg, innerFunc, error) {
    if (!this.errorMsgSet.has(msg)) {
      this.errorMsgSet.add(msg)
      runFunc(innerFunc.bind(this, error))
    }
  }

  processError ({error, devProcess, productionProcess, alertOnDev = true}) {
    const msg = error.toString()

    if (__DEV__) {
      if (devProcess) {
        devProcess(error)
      }
      if (alertOnDev) {
        this.func(msg, () => {
          Alert.alert(msg)
          console.log(error)
        })
      }
    } else {
      this.func(msg, productionProcess, error)
    }
  }
}

module.exports = ErrorStock
