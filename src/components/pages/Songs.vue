<template>
  <div class="music-list tab-content-active">
    <div v-if="!allMusic.length" class="empty-music">
      <h3>No music found</h3>
      <p></p>
      <button class="upload-btn" @click="uploadMusic">Upload Music</button>
    </div>

    <div class="music-header">
      <span class="index"></span>
      <span class="img"></span>
      <span class="title">Title</span>
      <!-- <span class="like"></span> -->
      <span class="artist">Artist</span>
      <span class="album">Album</span>
      <span class="genre">Genre</span>
      <span class="year"></span>
      <span class="duration">
        <i class="ion-android-alarm-clock" aria-hidden="true"></i>
      </span>
      <!-- <span class="more"></span> -->
    </div>
    <div class="music-scroller" v-if="allMusic.length">
      <div
        class="music"
        v-for="(music, index) in allMusic"
        :key="index"
        ref="musicItem"
        @click="select(music.id)"
        :class="{ playing: getCurrentId === music.id }"
      >
        <span
          class="index"
          v-if="getCurrentId !== music.id"
        >{{index+1 <= 9 ? '0' + (index + 1) : index+1}}</span>
        <span class="wave" v-if="getCurrentId === music.id">
          <div class="loader-container" :class="!music.isPlaying ? 'pauseAnim' : 'playAnim'">
            <div class="rectangle-1"></div>
            <div class="rectangle-5"></div>
            <div class="rectangle-3"></div>
          </div>
        </span>
        <span class="img">
          <img :src="music.picture || 'src/renderer/assets/img/cover.png'" alt>
        </span>
        <span class="title">{{music.title}}</span>
        <!-- <span class="like" @click.stop="like(music.id)">
          <i v-if="music.liked" class="fa fa-heart liked" aria-hidden="true"></i>
          <i v-if="!music.liked" class="fa fa-heart-o" aria-hidden="true"></i>
        </span>-->
        <span class="artist">{{music.artist}}</span>
        <span class="album">{{music.album}}</span>
        <span class="genre">{{music.genre[0]}}</span>
        <span class="year">{{music.year}}</span>
        <span class="duration">{{music.duration}}</span>
        <!-- <span class="more">
          <i class="fa fa-ellipsis-v"></i>
        </span>-->
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
import { setTimeout } from "timers";
import { ipcRenderer } from "electron";
const item_liked = "favorite-music-list",
  storedLikes = JSON.parse(localStorage.getItem(item_liked));
export default {
  name: "Songs",
  data() {
    return {
      scrollTo: null,
      liked: this.likeLists || null
    };
  },
  computed: {
    ...mapGetters([
      "allMusic",
      "playlist",
      "getCurrentId",
      "musicIndex",
      "likeLists"
    ])
  },
  watch: {},
  methods: {
    ...mapActions(["SELECT_MUSIC_ACT", "LIKE_MUSIC_ACT"]),
    ...mapMutations(["SET_PLAYLIST"]),
    select(id) {
      if (id != undefined) {
        if (this.allMusic.length) {
          this.SET_PLAYLIST(this.allMusic.slice(0));
        }
      }

      this.SELECT_MUSIC_ACT(id);
    },
    // like(id) {
    //   this.LIKE_MUSIC_ACT(id);

    //   this.allMusic.map(file => {
    //     if (id == file.id) {
    //       file.liked ? this.getLikes() : this.getLikes();
    //     }
    //   });
    // },
    // async showLikes() {
    //   let x = await JSON.parse(localStorage.getItem(item_liked));

    //   await this.allMusic.filter(async file =>
    //     x.indexOf(file.id) >= 0 ? (file.liked = true) : ""
    //   );
    // },
    getLikes() {
      let like = [];
      this.allMusic
        .filter(file => file.liked != 0)
        .forEach(file => like.push(file.id));
      this.updateLikes(like);
    },
    updateLikes(like) {
      localStorage.setItem(item_liked, JSON.stringify(like));
    },
    uploadMusic() {
      ipcRenderer.send("open-file-dialog");
    }
  },

  created() {
    // setTimeout(() => this.showLikes(), 2000);
    // this.showLikes();
  }
};
</script>

<style>
.empty-music {
  width: 100%;
  height: 100%;
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--fontColor);
}
.empty-music .upload-btn {
  background-color: var(--primaryColor);
  padding: 1em 2em;
  border: none;
  border-radius: 20px;
  margin-top: 1em;
  color: #fff;
  cursor: pointer;
}
.liked {
  color: var(--primaryColor) !important;
}
.music-list {
  height: 100%;
  background-color: var(--bgColor);
}
.music-scroller {
  height: calc(100% - 42px);
  overflow-y: auto;
  padding: 0 1em;
  /* transition: 300ms linear; */
  padding-bottom: 0.5em;
  margin-top: 42px;
}
.music-header {
  /* width: calc(100% - 2.5em); */
  width: 100%;
  left: 0;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 3em;
  position: absolute;
  background-color: var(--navBG);
}
.music-header span {
  text-transform: uppercase;
  color: var(--primaryColor);
  font-weight: bold;
  font-size: 10px;
}

.music-header .title,
.music-header .artist,
.music-header .album,
.music-header .genre {
  padding-left: 1em;
}

.music-header span i {
  font-size: 1.5em;
}

.index,
.wave,
.more,
.like {
  min-width: 20px;
  /* border: 1px solid blue; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.like {
  width: 30px !important;
}

.index,
.wave {
  margin-right: 2em;
}

.img {
  width: 60px;
}

.title,
.album,
.artist,
.genre {
  width: 25%;
  padding-right: 0.5em;
}

.duration,
.year {
  width: 100px;
}

.more {
  text-align: right;
}

.like {
  text-align: center;
  margin: 0 1em;
}

.like i,
.more i {
  font-size: 1.2em;
}

.more i:hover {
  color: var(--primaryColor) !important;
}

.duration {
  /* text-align: center; */
  text-align: right;
}

.music {
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.7em 2em;
  width: 100%;
  background-color: var(--bgColor);
}

.music:nth-child(2n) {
  background-color: var(--transColor);
}

.music:hover {
  background-color: var(--over);
  cursor: default;
}

.music > span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 12px;
}

.music .like i,
.music .more i {
  cursor: pointer;
  color: var(--fontColor);
  padding: 0 0.5em;
}

.img img {
  width: 30px;
  height: 30px;
  object-fit: cover;
  object-position: center;
  /* border: 1px solid blue; */
}

.playing {
  color: var(--primaryColor);
}

.music-wave {
  /* width: 50px !important; */
  position: relative;
  /* border: 1px solid blue; */
  display: flex;
  align-items: center;
  justify-content: center;
}

/* wave animation */
.loader-container {
  position: relative;
  height: 10px;
  width: 100%;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  /* border: 1px solid red; */
}

.loader-container > div {
  position: relative;
  display: inline-block;
  height: 4px;
  width: 2px;
  margin: 0;
  animation: load 1.5s ease-in-out infinite;
  background-color: var(--primaryColor);
}

.loader-container .rectangle-2 {
  -webkit-animation-delay: 0.1s;
  animation-delay: 0.1s;
}

.loader-container .rectangle-3 {
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
}

.loader-container .rectangle-4 {
  -webkit-animation-delay: 0.3s;
  animation-delay: 0.3s;
}

.loader-container .rectangle-5 {
  -webkit-animation-delay: 0.4s;
  animation-delay: 0.4s;
}

.loader-container .rectangle-6 {
  -webkit-animation-delay: 0.5s;
  animation-delay: 0.5s;
}

.pause-animation {
  -webkit-animation-play-state: paused;
  animation-play-state: paused;
  cursor: pointer;
}

.pauseAnim > div {
  animation-play-state: paused !important;
}

.playAnim > div {
  animation-play-state: running !important;
}

@keyframes load {
  0%,
  100% {
    transform: scaleY(1);
    /* background: #03a9f4; */
  }
  16.67% {
    transform: scaleY(3);
    /* background: #ff5722; */
  }
  33.33% {
    transform: scaleY(1);
    /* background: #ff5252; */
  }
  50% {
    transform: scaleY(3);
    /* background: #e91e63; */
  }
  66.67% {
    transform: scaleY(1);
    /* background: #9c27b0; */
  }
  83.34% {
    transform: scaleY(3);
    /* background: #673ab7; */
  }
}

.option {
  position: relative;
  overflow: visible;
}

.option-content {
  position: absolute;
  background-color: var(--navBG);
  padding: 1em;
  top: 0;
  right: 0;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 999;
  display: none;
}
</style>
