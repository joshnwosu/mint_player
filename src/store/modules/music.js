import fs from 'fs'
import path from 'path'
// import ID3Files from '../../utils/fileID3'
import { ipcRenderer } from 'electron'
// import startPlayer from '../../utils/start'
import * as mm from 'music-metadata'

import config from '../../lib/default'

const item_liked = 'favorite-music-list',
  storedLikes = JSON.parse(localStorage.getItem(item_liked))

const state = {
  musicList: [],
  Like: storedLikes || [],
  playlist: [],
  currentId: '',
  searchList: []
}

const getters = {
  playlist(state) {
    return state.playlist
  },
  allMusic(state) {
    return state.musicList.sort(function(a, b) {
      let nameA = a.title.toUpperCase()
      let nameB = b.title.toUpperCase()
      if (nameA < nameB) return -1
      if (nameA > nameB) return 1
      return 0
    })
  },
  getCurrentId(state) {
    return state.currentId
  },
  music(state) {
    const id = state.currentId
    return state.playlist.find(item => item.id === id) || {}
  },
  musicIndex(state) {
    const id = state.currentId
    return state.playlist.findIndex(item => item.id === id)
  },
  getSearch(state) {
    return state.searchList
  },
  searchCount(state) {
    return state.searchList ? state.searchList.length : 0
  },
  likeLists(state) {
    return state.Like
  }
}

const mutations = {
  SET_MUSIC: (state, files) => (state.musicList = files),
  SET_PLAYLIST: (state, files) => (state.playlist = files),
  SELECT_MUSIC: (state, arg) => (state.currentId = arg),
  SEARCH: (state, search) => (state.searchList = search),
  LIKE_MUSIC(state, id) {
    state.musicList.map(item => {
      if (id == item.id) {
        item.liked = !item.liked
      }
    })
  }
}

const actions = {
  GET_MUSIC_FILES({ commit }) {
    fs.readFile('path.log', 'utf-8', (err, buf) => {
      if (err) return
      let temp = [buf.toString()]
      scanDir(temp)
    })

    function scanDir(filePath) {
      if (!filePath || filePath[0] == 'undefined') return

      fs.readdir(filePath[0], (err, files) => {
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

        audioFiles(arg)
      })
    }

    ipcRenderer.on('selected-files', (event, arg) => {
      audioFiles(arg)
    })

    function convertDuration(length) {
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
    }

    function getFileImage(image, done) {
      let base64String = ''
      for (let j = 0; j < image.data.length; j++) {
        base64String += String.fromCharCode(image.data[j])
      }
      done('data:' + image.format + ';base64,' + window.btoa(base64String))
    }

    function audioFiles(arg) {
      let fileTags = []
      arg.files.forEach(file => {
        mm.parseFile(`${arg.path}/${file}`, { native: true }).then(metadata => {
          const result = {}
          const { title, album, artist, genre, year, picture } = metadata.common
          const duration = convertDuration(metadata.format.duration)

          result.file = `file://${arg.path}/${encodeURIComponent(file)}`
          result.title = title || path.parse(file).name
          result.album = album || '--unknown--'
          result.artist = artist || '--unknown--'
          result.genre = genre || ['--unknown--']
          result.duration = duration || '00:00'
          result.year = year || ''
          result.liked = false
          result.isPlaying = false
          result.id = `${arg.path}/${file}`

          fileTags.push(result)

          if (picture) {
            let picture = metadata.common.picture[0]
            getFileImage(picture, function(imagesource) {
              result.picture = imagesource || './assets/img/cover.png'
            })
          } else {
            result.picture = './assets/img/cover.png'
          }
        })
      })
      commit('SET_MUSIC', fileTags)
      commit('SET_PLAYLIST', fileTags)
    }
  },
  SELECT_MUSIC_ACT({ commit }, arg) {
    commit('SELECT_MUSIC', arg)
  },
  SEARCH_LIST({ commit }, search) {
    commit('SEARCH', search)
  },
  LIKE_MUSIC_ACT({ commit }, arg) {
    commit('LIKE_MUSIC', arg)
  }
}

export default {
  state,
  getters,
  mutations,
  actions
}
