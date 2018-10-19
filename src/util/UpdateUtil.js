
import {downloadUpdate, switchVersion, isFirstTime, isRolledBack, markSuccess} from 'react-native-update'
import DeviceInfo from 'react-native-device-info'
import {Platform, Alert, Linking, NativeModules} from 'react-native'
import RNFetchBlob from 'react-native-fetch-blob'
const RNFS = require('react-native-fs')
const {FuncUtil} = require('@ys/vanilla')
const {runFunc} = FuncUtil
const {httpPost} = require('./NetInfoUtil')

// customInfo, id, name, versionLocal,previewVersion, isDevMode, isPreviewVersionClient
class UpdateUtil {
  constructor ({checkUpdateUrl, versionLocal, processError}) {
    this.checkUpdateUrl = checkUpdateUrl
    this.versionLocal = versionLocal
    this.processError = processError
    this.downloadApkCount = 0
    this.init()
  }

  init () {
    if (isFirstTime) {
      markSuccess()
    }
    if (isRolledBack) {
      this.manualUpdate(`应用更新失败,已经重新恢复到版本${this.versionLocal}`)
    }
  }

  manualUpdate (option) {
    const {info, manualDownloadUrl} = option
    Alert.alert('提示', `${info},是否手动下载最新版本?`,
      {text: '取消', onPress: null, style: 'cancel'},
      {
        text: '确认',
        onPress: () => {
          Linking.openURL(manualDownloadUrl).catch(error => {
            runFunc(this.processError.bind(null, error))
          })
        }
      },
      { cancelable: false }
    )
  }

  async checkUpdateGeneral (option) {
    const {customInfo, beforeUpdate, noUpdateCb, errorCb} = option
    const result = await httpPost({
      url: this.checkUpdateUrl,
      param: {
        os: Platform.OS,
        bundleId: DeviceInfo.getBundleId(),
        uniqueId: DeviceInfo.getUniqueID(),
        buildNumberClient: DeviceInfo.getVersion(),
        __DEV__,
        customInfo
      }
    })
    if (__DEV__) {
      // console.log(result)
    } else {
      const {needUpdate, isHotUpdate, error} = result

      if (error) {
        runFunc(errorCb.bind(null, error))
      } else {
        if (needUpdate) {
          if (isHotUpdate) {
            this.hotUpdate({
              beforeUpdate, noUpdateCb, result
            })
          } else {
            this.nativeUpdate({
              beforeUpdate, noUpdateCb, result
            })
          }
        } else {
          runFunc(noUpdateCb)
        }
      }
    }
  }

  async nativeUpdate (option) {
    const {result, beforeUpdate} = option

    const {hash, manifestUrl, fileName} = result

    if (Platform.OS === 'android') {
      let filePath = RNFS.ExternalDirectoryPath + `/${fileName}`
      const fileExist = await RNFS.exists(filePath)
      if (fileExist) {
        const localHash = await RNFS.hash(filePath, 'md5')
        if (localHash === hash) {
          UpdateUtil.installApk(filePath)
        } else {
          this.downloadAndInstallApk({
            filePath, result
          })
        }
      } else {
        this.downloadAndInstallApk({
          filePath, result
        })
      }
    } else {
      this.informUpdate(result, beforeUpdate, () => {
        console.log(manifestUrl)

        Linking.openURL(manifestUrl)
      })
    }
  }

  static installApk (filePath) {
    NativeModules.AndroidUtil.install(filePath)
  }

  downloadAndInstallApk (option) {
    const {result, filePath} = option
    const {apkUrl, hash, manualDownloadUrl} = result
    RNFetchBlob.config({
      useDownloadManager: true,
      fileCache: true,
      path: filePath
    }).fetch('GET', apkUrl).progress({ count: 10 }).then(() => {
      RNFS.hash(filePath, 'md5').then(localHash => {
        if (localHash === hash) {
          this.downloadApkCount = 0

          this.informUpdate(result, () => {
            this.installApk(filePath)
          })
        } else {
          this.downloadApkCount++
          if (this.downloadApkCount > 5) {
            this.downloadApkCount = 0
            throw new Error(`download ${this.downloadApkCount} times,fail`)
          } else {
            setTimeout(() => {
              this.downloadAndInstallApk(option)
            }, 1000 * 60)
          }
        }
      })
    }).catch((error) => {
      console.log({error})
      this.manualUpdate({
        info: '下载apk文件失败,已停止更新',
        manualDownloadUrl
      })
    })
  }

  hotUpdate (option) {
    const {result, beforeUpdate, noUpdateCb, appId} = option

    const {ppkUrl, manualDownloadUrl} = result
    let param = {
      updateUrl: ppkUrl,
      hash: appId, // hash必须是字符串
      update: true
    }
    try {
      // 一旦downloadUpdate,下次重启必然更新
      this.informUpdate(result, beforeUpdate, () => {
        downloadUpdate(param).then(hash => {
          switchVersion(hash)
        })
      })
    } catch (error) {
      runFunc(noUpdateCb)
      this.manualUpdate({
        manualDownloadUrl,
        info: `下载更新出现错误,已停止更新`
      })
    }
  }

  async informUpdate (result, beforeUpdate, updateNow) {
    if (beforeUpdate) {
      await beforeUpdate()
    }
    const {isForce, isPreviewVersion, nextVersion, newVersion, isSilent} = result
    if (isSilent) {
      updateNow()
    } else {
      const optionAry = [
        {text: '取消', style: 'cancel'},
        {
          text: '确认',
          onPress: updateNow
        }
      ]
      let ask = '是否马上升级?'
      if (isForce) {
        optionAry.shift()
        ask = '请马上升级'
      }
      Alert.alert(
        '提示',
        `有${isPreviewVersion ? `预览版本${nextVersion}` : `最新版本${newVersion}`},${ask}`,
        optionAry,
        { cancelable: false }
      )
    }
  }
}

module.exports = UpdateUtil
