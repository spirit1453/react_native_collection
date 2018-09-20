const childProcess = require('child_process')
const {ModuleUtil} = require('@ys/collection')
const {isDependency} = ModuleUtil
const path = require('path')
const rootPath = path.resolve(__dirname, '../')

if (!isDependency(rootPath)) {
  childProcess.execSync(`
     npm i @ys/eslint-config-rn -D
    `)
}
