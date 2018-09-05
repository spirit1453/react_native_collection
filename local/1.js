const path = require('path')
const rootPath = path.resolve(__dirname, '../')
const simpleGit = require('simple-git')(rootPath)
const packagePath = path.resolve(rootPath, 'package.json')
const packageJson = require(packagePath)
const fs = require('fs')

simpleGit.log((err, summary) => {
  if (err) {
    throw err
  } else {
    const {latest} = summary
    const {date, hash, message} = latest
    packageJson.gitInfo = {
      date, hash, message
    }
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2))
  }

  console.log('end')
})