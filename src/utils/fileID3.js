import fs from 'fs'
import path from 'path'
import utils from './'
import * as mm from 'music-metadata'
import config from '../lib/default'

export default {
  convertDuration(length) {
    let seconds = Math.floor(length % 60) || 0
    let minutes = Math.floor(length / 60) || 0
    let hours = Math.floor(minutes / 60) || 0

    hours %= 24
    minutes %= 60
    seconds %= 60

    seconds = seconds <= 9 ? '0' + seconds : seconds
    minutes = minutes <= 9 ? '0' + minutes : minutes
    hours = hours <= 9 ? '0' + hours : hours

    return length >= 3600
      ? `${hours}:${minutes}:${seconds}`
      : `${minutes}:${seconds}`
  },
  getFileImage(image, done) {
    let base64String = ''
    for (let j = 0; j < image.data.length; j++) {
      base64String += String.fromCharCode(image.data[j])
    }
    done('data:' + image.format + ';base64,' + window.btoa(base64String))
  },
  Tags() {
    let fileTags = []
    utils.readDirSync(config.musicPath).forEach(file => {
      mm.parseFile(file, {
        native: true
      }).then(metadata => {
        const result = {}
        const { title, album, artist, genre, year, picture } = metadata.common
        const duration = this.convertDuration(metadata.format.duration)
        const size = fs.statSync(file)
        result.filename = `${encodeURIComponent(path.parse(file).base)}`
        result.file = `file:///${path.parse(file).dir + '/' + result.filename}`
        result.title = title || path.parse(file).name
        result.album = album || '--unknown--'
        result.artist = artist || '--unknown--'
        result.genre = genre || ['--unknown--']
        result.duration = duration || '00:00'
        result.year = year || ''
        result.fileSize = size.size
        result.liked = false
        result.isPlaying = false
        result.id = `file:///${file}`

        fileTags.push(result)

        if (picture) {
          this.picture = metadata.common.picture[0]
          this.getFileImage(this.picture, function(imagesource) {
            result.picture = imagesource || './assets/img/cover.png'
          })
        } else {
          result.picture = './assets/img/cover.png'
        }
      })
    })
    return fileTags
  }
}
