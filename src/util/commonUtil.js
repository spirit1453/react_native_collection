
const commonUtil = {
  getFolderId (filePath) {
    return filePath.split('/')[6]
  },
  getAvatarSource (pic, defaultPic) {
    let result
    if (pic) {
      result = {uri: pic}
    } else {
      result = defaultPic
    }
    return result
  },
  pad (num) {
    num = String(num)
    if (num.length === 1) {
      num = '0' + num
    }
    return num
  }

}
Object.freeze(commonUtil)

module.exports = commonUtil
