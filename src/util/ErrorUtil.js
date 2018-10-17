
const ErrorStock = require('./ErrorStock')

class ErrorUtil {
  static setGlobalErrorHandler ({devProcess, productionProcess, resetTime, ErrorUtilRN}) {
    const errorStock = new ErrorStock(resetTime)

    ErrorUtilRN.setGlobalHandler((error) => {
      errorStock.processError({error, devProcess, productionProcess})
    })
  }
  static init () {
    console.ignoredYellowBox = ['Setting a timer', 'Remote debugger']
  }
}
ErrorUtil.init()

Object.freeze(ErrorUtil)
module.exports = ErrorUtil
