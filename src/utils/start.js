import { ipcRenderer } from 'electron'
import fs from 'fs'

fs.readFile('path.txt', 'utf-8', (err, buf) => {
  if (err) return
  let temp = [buf.toString()]
  scanDir(temp)
})

function scanDir(filePath) {
  if (!filePath || filePath[0] == 'undefined') return

  fs.readdir(filePath[0], function(err, files) {
    var arr = []
    for (var i = 0; i < files.length; i++) {
      if (
        files[i].substr(-4) === '.mp3' ||
        files[i].substr(-4) === '.m4a' ||
        files[i].substr(-5) === '.webm' ||
        files[i].substr(-4) === '.wav' ||
        files[i].substr(-4) === '.aac' ||
        files[i].substr(-4) === '.ogg' ||
        files[i].substr(-5) === '.opus'
      ) {
        arr.push(files[i])
      }
    }
    var arg = {}
    arg.files = arr
    arg.path = filePath

    startPlayer(arg)
  })
}

ipcRenderer.on('selected-files', (event, arg) => {
  startPlayer(arg)
})

function startPlayer(arg) {
  return arg
}

export default startPlayer
