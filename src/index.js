
import ScanView from './view/ScanView'
import DelayIndicator from './widget/DelayIndicator'
import HeaderRightButton from './widget/HeaderRightButton'
import TextInputWrapper from './widget/TextInputWrapper'
import CenterLayout from './layout/CenterLayout'
const commonUtil = require('./util/commonUtil')
const ErrorUtil = require('./util/ErrorUtil')
const NetInfoUtil = require('./util/NetInfoUtil')
const ErrorStock = require('./util/ErrorStock')

const common = {
  commonUtil,
  ScanView,
  DelayIndicator,
  HeaderRightButton,
  TextInputWrapper,
  ErrorUtil,
  CenterLayout,
  ErrorStock,
  NetInfoUtil
}

Object.freeze(common)
module.exports = common
