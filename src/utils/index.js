const fs = require('fs')
const path = require('path')
import config from '../lib/default'

export default {
  readDirSync(dirPath) {
    if (!fs.existsSync(dirPath)) {
      return []
    }

    let fileList = []
    fs.readdirSync(dirPath).forEach(item => {
      if (item.match(/^\./)) {
        return
      }

      const newPath = path.join(dirPath, item)
      if (fs.lstatSync(newPath).isDirectory()) {
        fileList = fileList.concat(this.readDirSync(newPath))
      } else {
        fileList.push(newPath)
      }
    })

    return fileList.filter(
      file => config.allowKeys.indexOf(path.extname(file)) >= 0
    )
  }
}
