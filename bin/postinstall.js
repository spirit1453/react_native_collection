const childProcess = require('child_process')
// todo postinstall should decide whether in publish use
childProcess.execSync(`
     npm i @ys/eslint-config-rn -D
    `)
