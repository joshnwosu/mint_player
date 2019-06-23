<template>
  <div id="control-panel">
    <div class="queue-overlay" @click="queue"></div>
    <div class="queue-list" ref="queueList">
      <div class="headline">
        <div>
          <span @click="queue" class="close-queue">
            <i class="ion-close"></i>
          </span>
        </div>
        <div>
          <p>Playing Queue</p>
          <p class="len">- {{playlist.length}}</p>
        </div>
      </div>
      <div class="queue-scroller" ref="musicScroller" @wheel.passive="clearScrollAnimate">
        <ul>
          <li
            v-for="(list, index) in playlist"
            :key="index"
            :class="{ playing: getCurrentId === list.id }"
            ref="musicItem"
            @click="select(list.id)"
          >
            <div class="left-list">
              <span>{{index+1 <= 9 ? '0' + (index + 1) : index+1}}</span>
              <div class="list-title">
                <span>{{list.title}}</span>
                <span>{{list.artist}}</span>
              </div>
            </div>

            <div class="right-list">
              <span>{{list.duration}}</span>
              <span class="remove-queue" @click.stop="removeQueue(list.id)">
                <i class="ion-android-close"></i>
              </span>
            </div>
          </li>
        </ul>
      </div>
    </div>
    <audio ref="audio" :src="music.file" crossorigin="anonymous"></audio>
    <div class="left">
      <div class="cover">
        <!-- <img src="src/renderer/assets/img/cover.jpg" alt> -->
        <img :src="music.picture || 'assets/img/cover.png'" alt>
      </div>
      <div class="cover-caption">
        <p class="artist">{{music.title || 'Empty'}}</p>
        <p class="title">{{music.artist || 'Pick a music'}}</p>
      </div>
    </div>
    <div class="middle">
      <div class="previous-up">
        <p class="tint">Previous</p>
        <p ref="prevTitle"></p>
        <p ref="prevArtist" class="ll"></p>
        <!-- <p>{{playlist[musicIndex-1 < 0 ? musicIndex = playlist.length - 1 : 0].title}}</p> -->
      </div>
      <div class="control-bar">
        <div class="control-btns">
          <span></span>
          <!-- <span class="heart" @click.stop="like(music.id)">
            <i v-if="music.liked" class="fa fa-heart liked" aria-hidden="true"></i>
            <i v-if="!music.liked" class="fa fa-heart-o" aria-hidden="true"></i>
          </span>-->
          <div>
            <span ref="shuffle" class="shuffle" @click="shuffle()">
              <i class="fa fa-random" aria-hidden="true"></i>
            </span>
            <span @click="prev()" class="prev">
              <i class="ion-skip-backward"></i>
            </span>
            <span class="playPause" @click="playPause()">
              <i
                :class="{'ion-ios-play': !audioStatus.playing, 'ion-ios-pause': audioStatus.playing}"
              ></i>
            </span>
            <span @click="next()" class="next">
              <i class="ion-skip-forward"></i>
            </span>
            <span ref="repeat" class="repeat" @click="repeat()">
              <i class="fa fa-refresh" aria-hidden="true"></i>
              <span style="opacity: 0">1</span>
            </span>
          </div>

          <span class="queue" @click="queue">
            <!-- <i class="ion-arrow-down-b"></i> -->
            <img src="assets/img/queue.svg" alt>
            <!-- <i class="fa fa-bars"></i> -->
          </span>
        </div>
        <div class="progress-bar">
          <div class="current-time">{{duration(audioStatus.currentTime)}}</div>
          <div class="bar" @click="changeTime" @mousemove="hoverMove" @mouseout="leave">
            <div class="barBG"></div>
            <div class="fill" :style="progress">
              <div class="pin"></div>
            </div>
            <div class="hover" ref="fillHover"></div>
          </div>
          <div class="duration-time">{{duration(audioStatus.duration)}}</div>
        </div>
      </div>
      <div class="next-up">
        <p class="tint">Up Next</p>
        <p ref="nextTitle"></p>
        <p ref="nextArtist" class="ll"></p>
        <!-- <p>{{playlist[musicIndex+1 >= playlist.length ? 0 : musicIndex+1].title}}</p> -->
      </div>
    </div>
    <div class="right">
      <!-- <div class="pilote-mode">
        <span class="expand" @click="nowPlaying" ref="expand">
          <i class="fa fa-expand" aria-hidden="true"></i>
        </span>
      </div>-->
      <div class="vol">
        <span>
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              fill-rule="evenodd"
              d="M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z"
              id="speaker"
            ></path>
          </svg>
        </span>
        <div class="bar">
          <div class="barBG"></div>
          <div class="fill">
            <div class="pin"></div>
          </div>
        </div>
        <span class="vol-percent">50 %</span>
      </div>
    </div>
  </div>
</template>

<script>
import { remote } from "electron";
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
import stage from "../../lib/index";
export default {
  name: "control-panel",
  data() {
    return {
      scrollTo: null,
      audioStatus: {
        playing: false,
        currentTime: "",
        duration: "",
        lastPlayed: [],
        shuffle: false,
        repeat: 0,
        counter: 0
      }
    };
  },
  computed: {
    // ...mapState(["currentId", "musicList"]),
    ...mapGetters([
      "playlist",
      "allMusic",
      "getCurrentId",
      "music",
      "musicIndex"
    ]),

    progress() {
      const status = this.audioStatus;
      return {
        width: status.currentTime
          ? Math.ceil((status.currentTime / status.duration) * 100) + "%"
          : "0"
      };
    }
    // fillHover() {
    //   return {
    //     width:
    //   }
    // }
  },
  watch: {
    getCurrentId() {
      this.$nextTick(() => {
        this.$refs.audio.load();
        this.$refs.audio.play();
      });
      this.updatePosition();
      this.upNextAndPrevious();
    }
  },
  methods: {
    ...mapActions(["SELECT_MUSIC_ACT", "LIKE_MUSIC_ACT"]),
    ...mapMutations(["SET_PLAYLIST"]),
    nowPlaying() {
      let now_playing = document.querySelector(".now-playing");
      let expand = this.$refs.expand;
      expand.firstElementChild.classList.toggle("active-shuffle");
      now_playing.classList.toggle("is-active");
    },
    queue() {
      document.body.classList.toggle("open-queue");
      this.updatePosition();
    },
    select(id) {
      if (id != undefined) {
        if (this.playlist.length) {
          this.SET_PLAYLIST(this.playlist.slice(0));
        }
      }

      this.SELECT_MUSIC_ACT(id);
    },
    // like(id) {
    //   this.LIKE_MUSIC_ACT(id);
    // },
    removeQueue(id) {
      let index = this.musicIndex;
      let remain = this.playlist.filter(list => list.id !== id);
      this.SET_PLAYLIST(remain);

      if (this.getCurrentId == id) {
        this.playTrack(index);
      }

      // console.log(x);
    },
    playTrack(index) {
      if (!this.playlist) return;
      else {
        if (this.playlist[index]) {
          this.audioStatus.lastPlayed.push(index);
        }
        this.SELECT_MUSIC_ACT(
          this.playlist[index >= this.playlist.length ? 0 : index].id
        );
      }
      this.upNextAndPrevious();
    },
    playPause() {
      if (!this.music.file) {
        return this.next();
      }
      if (this.$refs.audio.paused) {
        this.$refs.audio.play();
      } else {
        this.$refs.audio.pause();
      }
      this.upNextAndPrevious();
    },
    // next music
    next() {
      let index = this.musicIndex;
      if (!this.audioStatus.shuffle) {
        index++;
        if (index > this.playlist.length - 1) {
          index = 0;
        }
      } else {
        if (this.playlist.length > 1) {
          let temp = index;
          while (index == temp) {
            index = Math.floor(Math.random() * this.playlist.length);
          }
        }
      }
      if (this.playlist[index]) {
        // if (this.$refs.audio.played) {

        // }
        this.playTrack(index);

        // console.log(index);
        // console.log("Hello");
        // console.log(index);
      }
    },
    // prev music
    prev() {
      if (!this.music.file) return;
      let index = this.musicIndex;
      if (!this.audioStatus.shuffle) {
        if (index == 0) {
          index = this.playlist.length - 1;
        } else {
          index--;
        }
      } else {
        this.audioStatus.lastPlayed.pop();
        index = this.audioStatus.lastPlayed.pop();
      }

      if (index == undefined || index < 0) {
        index = 0;
      }
      this.playTrack(index);
    },
    shuffle(elem) {
      if (!this.music.file) return;
      let that = this.$refs.shuffle;
      if (that.classList.contains("active-shuffle")) {
        that.classList.remove("active-shuffle");
        that.setAttribute("title", "Shuffle Off");
        this.audioStatus.shuffle = false;
      } else {
        that.classList.add("active-shuffle");
        that.setAttribute("title", "Shuffle On");
        this.audioStatus.shuffle = true;

        if (this.audioStatus.repeat == 2) {
          let repeat = this.$refs.repeat;
          let that = repeat;

          let span = that.querySelector("span");
          span.style.opacity = "0";
          that.setAttribute("title", "Repeat All");
          this.audioStatus.repeat = 1;
        }
      }
      this.upNextAndPrevious();
    },
    // Turn repeat on and off
    // repeat = 0 Repeat is off - when the playlist reaches it's end it will stop
    // repeat = 1 Repeat all - when the playlist reaches it's end it will start from begining
    // repeat = 2 Repeat Current - repeat track
    repeat() {
      if (!this.music.file) return;
      let that = this.$refs.repeat;
      if (this.audioStatus.repeat == 0) {
        that.classList.add("active-shuffle");
        that.setAttribute("title", "Repeat All");
        this.audioStatus.repeat = 1;
      } else if (this.audioStatus.repeat == 1) {
        let span = that.querySelector("span");
        span.style.opacity = "1";
        that.setAttribute("title", "Repeat Current");
        this.audioStatus.repeat = 2;

        if (this.audioStatus.shuffle) {
          let shuffle = this.$refs.shuffle;
          let that = shuffle;

          if (that.classList.contains("active-shuffle")) {
            that.classList.remove("active-shuffle");
            that.setAttribute("title", "Shuffle Off");
            this.audioStatus.shuffle = false;
          } else {
            that.classList.add("active-shuffle");
            that.setAttribute("title", "Shuffle On");
            this.audioStatus.shuffle = true;
          }
        }
      } else if (this.audioStatus.repeat == 2) {
        let span = that.querySelector("span");
        span.style.opacity = "0";
        that.classList.remove("active-shuffle");
        that.setAttribute("title", "Repeat Off");
        this.audioStatus.repeat = 0;
      }
      this.upNextAndPrevious();
      // console.log(that);
    },
    // change play time
    changeTime(e) {
      if (!this.music.file) {
        return;
      }

      const rect = e.currentTarget.getBoundingClientRect();
      const len = e.pageX - rect.left;
      const ratio = len / rect.width;
      this.$refs.audio.play();
      // use timeout to make sure audio has playing
      setTimeout(() => {
        this.$refs.audio.currentTime = ratio * this.audioStatus.duration;
      });
    },

    hoverMove(e) {
      // console.log(e.pageX);
      const rect = e.currentTarget.getBoundingClientRect();
      const len = e.pageX - rect.left;
      const ratio = len / rect.width;
      const fillHover = this.$refs.fillHover;
      fillHover.style.width = `${ratio * 100}%`;
      fillHover.style.opacity = "1";

      // this.leave();
    },

    leave() {
      const fillHover = this.$refs.fillHover;
      fillHover.style.opacity = "0";
    },

    changeVolume() {
      let audio = this.$refs.audio;
      let e = document.querySelector(".vol .bar");
      let eInner = document.querySelector(".vol .fill");
      let speaker = document.querySelector("#speaker");
      let volPercent = document.querySelector(".vol-percent");
      let drag = false;

      audio.volume = 0.5;

      e.addEventListener("mousedown", function(ev) {
        drag = true;
        updateBar(ev.clientX);
      });

      e.addEventListener("mousemove", function(ev) {
        if (drag) {
          updateBar(ev.clientX);
        }
      });

      document.addEventListener("mouseup", function(ev) {
        drag = false;
      });

      let updateBar = function(x, vol) {
        let volume = e;
        let percentage;

        if (vol) {
          percentage = vol * 100;
        } else {
          var position = x - volume.offsetLeft;
          percentage = (100 * position) / volume.clientWidth;
        }

        if (percentage > 100) {
          percentage = 100;
        }

        if (percentage < 0) {
          percentage = 0;
        }

        // update volume bar
        eInner.style.width = percentage + "%";
        volPercent.textContent = Math.floor(percentage) + "%";
        audio.volume = percentage / 100;

        if (audio.volume >= 0.5) {
          speaker.attributes.d.value =
            "M14.667 0v2.747c3.853 1.146 6.666 4.72 6.666 8.946 0 4.227-2.813 7.787-6.666 8.934v2.76C20 22.173 24 17.4 24 11.693 24 5.987 20 1.213 14.667 0zM18 11.693c0-2.36-1.333-4.386-3.333-5.373v10.707c2-.947 3.333-2.987 3.333-5.334zm-18-4v8h5.333L12 22.36V1.027L5.333 7.693H0z";
        } else if (audio.volume < 0.5 && audio.volume > 0.05) {
          speaker.attributes.d.value =
            "M0 7.667v8h5.333L12 22.333V1L5.333 7.667M17.333 11.373C17.333 9.013 16 6.987 14 6v10.707c2-.947 3.333-2.987 3.333-5.334z";
        } else if (audio.volume <= 0.05) {
          speaker.attributes.d.value =
            "M0 7.667v8h5.333L12 22.333V1L5.333 7.667";
        }
      };
    },

    init() {
      const audio = this.$refs.audio;
      if (audio) {
        this.$root.$emit("audio-play", audio);
      }

      if (!audio) {
        this.next();
      }

      audio.onended = () => {
        let index = this.musicIndex;
        // In case shuffle is on
        if (this.audioStatus.shuffle) {
          if (this.playlist.length > 1) {
            let temp = index;
            while (index == temp) {
              index = Math.floor(Math.random() * this.playlist.length);
            }
            if (this.playlist[index]) {
              this.playTrack(index);
            }
          }
        }
        // In case shuffle is off.
        else {
          if (!this.audioStatus.repeat) {
            if (index >= this.playlist.length - 1) {
              console.log("All music played");
            } else {
              index++;
              this.playTrack(index);
            }
          } else if (this.audioStatus.repeat == 1) {
            if (index >= this.playlist.length - 1) {
              index = 0;
            } else {
              index++;
            }
            this.playTrack(index);
          } else if (this.audioStatus.repeat == 2) {
            if (this.playlist[index]) {
              // this.playTrack(index);
              this.$refs.audio.play();
            }
          }
        }
      };

      audio.ontimeupdate = () => {
        // clearTimeout(endTimeout);
        this.audioStatus.currentTime = audio.currentTime;
        const lessTime =
          this.audioStatus.duration - this.audioStatus.currentTime;
      };

      audio.oncanplay = () => {
        this.audioStatus.duration = audio.duration;
      };

      audio.onplaying = () => {
        this.audioStatus.playing = true;

        this.playlist.forEach(music => (music.isPlaying = false));

        this.playlist[this.musicIndex].isPlaying = true;
      };

      audio.onpause = () => {
        this.audioStatus.playing = false;

        this.playlist.forEach(music => (music.isPlaying = false));
      };
    },

    duration(length) {
      let seconds = Math.floor(length % 60) || 0;
      let minutes = Math.floor(length / 60) || 0;
      let hours = Math.floor(minutes / 60) || 0;

      hours %= 24;
      minutes %= 60;
      seconds %= 60;

      seconds = seconds <= 9 ? "0" + seconds : seconds;
      minutes = minutes <= 9 ? "0" + minutes : minutes;
      hours = hours <= 9 ? "0" + hours : hours;

      return length >= 3600
        ? `${hours}:${minutes}:${seconds}`
        : `${minutes}:${seconds}`;
    },
    updatePosition(isMiddle, rightNow) {
      // console.log(this.getCurrentId);
      const index = this.playlist.findIndex(
        item => item.id === this.getCurrentId
      );

      if (index < 0) {
        return;
      }

      const rect = this.$refs.musicItem[index].getBoundingClientRect();
      const scroller = this.$refs.musicScroller;
      const srect = scroller.getBoundingClientRect();
      const sheight = scroller.clientHeight - srect.top;
      const topDis = rect.top - srect.top;
      let scrollTo = null;

      if (isMiddle) {
        // move to middle position
        scrollTo = scroller.scrollTop + topDis - (sheight - rect.height) / 2;
      } else {
        // auto calculate visible position
        const min = rect.height * 2;
        const max = sheight - rect.height * 3;
        if (topDis < min) {
          scrollTo = scroller.scrollTop + topDis - min;
        } else if (topDis > max) {
          scrollTo = scroller.scrollTop + topDis - max;
        }
      }

      if (scrollTo === null) {
        return;
      }

      if (rightNow) {
        scroller.scrollTop = scrollTo;
      } else {
        this.scrollTo = scrollTo;
      }
    },
    animate() {
      const scroller = this.$refs.musicScroller;
      // stop animation while scrollTo was null,
      // or scrollTop never change (it means the scroller has scrolled to the top or the end)
      if (this.scrollTo === null || this.oldScrollTop === scroller.scrollTop) {
        this.clearScrollAnimate();
        return;
      }

      const dis = this.scrollTo - scroller.scrollTop;
      this.oldScrollTop = scroller.scrollTop;
      if (Math.abs(dis) < 10) {
        scroller.scrollTop = this.scrollTo;
        this.scrollTo = null;
      } else {
        scroller.scrollTop += dis * 0.2;
      }
    },
    clearScrollAnimate() {
      this.scrollTo = null;
      this.oldScrollTop = null;
    },
    upNextAndPrevious() {
      // const index = this.playlist.findIndex(
      //   item => item.id === this.getCurrentId
      // );
      let index = this.musicIndex;

      this.$refs.nextTitle.textContent = this.playlist[
        index + 1 >= this.playlist.length ? 0 : index + 1
      ].title;

      this.$refs.nextArtist.textContent = this.playlist[
        index + 1 >= this.playlist.length ? 0 : index + 1
      ].artist;

      this.$refs.prevTitle.textContent = this.playlist[
        index - 1 < 0 ? this.playlist.length - 1 : index - 1
      ].title;

      this.$refs.prevArtist.textContent = this.playlist[
        index - 1 < 0 ? this.playlist.length - 1 : index - 1
      ].artist;

      const _$nextUp = document.querySelector(".next-up"),
        _$previuosUp = document.querySelector(".previous-up");

      if (this.audioStatus.shuffle) {
        _$nextUp.style.display = "none";
        _$previuosUp.style.display = "none";
      } else {
        _$nextUp.style.display = "block";
        _$previuosUp.style.display = "block";
      }
    }
  },
  mounted() {
    stage.add(this);
    this.init();
    this.updatePosition(true, true);
    this.changeVolume();
  }
};
</script>

<style scoped>
span svg {
  width: 18px;
  height: 18px;
  fill: var(--primaryColor);
}
#control-panel {
  background-color: var(--controlBG);
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 9;
  display: flex;
  justify-content: space-between;
  align-items: stretch;
}

i {
  font-size: 1em;
}

.heart i {
  color: var(--fontColor);
}

.liked {
  color: var(--primaryColor) !important;
  /* color: rgb(243, 74, 74) !important; */
}

.left,
.middle,
.right {
  padding: 0 1em;
}

.left,
.right {
  width: 250px;
  white-space: nowrap;
}

.left,
.right {
  display: flex;
  align-items: center;
}

.right > div {
  margin-right: 0.5em;
}

.right span {
  padding: 0.3em;
  cursor: pointer;
}

/* .right span i {
  font-size: 1.2em;
} */

.vol {
  width: 100%;
  display: flex;
  align-items: center;
}

.vol > * {
  margin: 0 0.2em;
}

.vol-percent {
  font-size: 12px;
  font-weight: 900;
  color: var(--primaryColor);
  opacity: 0.7;
}

.cover {
  width: 50px;
  height: 50px;
}
.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
}

.cover-caption {
  margin-left: 1em;
  position: relative;
}

.cover-caption .artist {
  font-size: 14px;
  font-weight: 600;
  width: 100px;
}

.cover-caption .title {
  font-size: 12px;
  font-weight: 400;
  color: var(--fontColor);
  width: 100px;
}

.cover-caption .artist,
.cover-caption .title {
  width: 150px;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

.middle {
  width: calc(100% - 500px);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.middle .next-up,
.middle .previous-up {
  font-size: 12px;
}

.middle .next-up p,
.middle .previous-up p {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100px;
}

.middle .next-up .tint,
.middle .previous-up .tint {
  color: var(--primaryColor);
  margin-bottom: 2px;
  /* font-size: 10px; */
  font-weight: 600;
  text-transform: uppercase;
}

.middle .next-up {
  text-align: right;
}
.middle .previous-up {
  text-align: left;
}

.control-bar {
  width: 100%;
  height: 100%;
  padding: 0 1em;
  /* border: 1px solid blue; */
}

i,
i::after,
i::before {
  padding: 0;
  margin: 0;
  line-height: 0.5 !important;
}

.control-btns {
  width: 100%;
  height: 60%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

.control-btns > div {
  display: flex;
  align-items: center;
}

.control-btns span {
  /* font-size: 1.2em; */
  margin: 0 0.5em;
  /* color: var(--primaryColor); */
  /* border: 1px solid red; */
  padding: 0 0.5em;
  cursor: pointer;
}

.control-btns .playPause {
  font-size: 2em;
  /* color:  */
}

.prev,
.playPause,
.next {
  color: var(--primaryColor);
}

.progress-bar {
  height: 40%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;
  font-size: 12px;
}

.bar {
  width: 80%;
  height: 0px;
  background-color: transparent;
  border-radius: 3px;
  position: relative;
  /* border: 2px solid transparent; */
  cursor: pointer;
  transition: all 300ms linear;
  /* border: 1px solid red; */
  padding: 0.7em 2em;
  position: relative;
}

.bar .barBG,
.bar .fill,
.bar .hover {
  width: 50%;
  height: 15%;
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  border-radius: 3px;
  transform: translateY(-50%);
}

.bar .barBG {
  width: 100%;
}

.bar .barBG {
  background-color: var(--progressbar);
  height: 10% !important;
}

.bar .fill {
  width: 50%;
  background-color: var(--primaryColor);
  border-radius: 3px;
  z-index: 2;
  transition: 300ms linear;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.bar .fill .pin {
  width: 13px;
  height: 13px;
  position: absolute;
  right: 0;
  background-color: var(--primaryColor);
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0px 2px 1px 0 rgba(0, 0, 0, 0.2);
}

.bar .hover {
  background-color: var(--fillHover);
  border-radius: 3px;
  z-index: 1;
  transition: 300ms linear;
  opacity: 0;
}

.queue i {
  color: var(--fontColor);
}

.queue img {
  width: 40px;
  /* opacity: 0.5; */
}
.shuffle,
.repeat,
.expand {
  color: var(--fontColor);
}

.active-shuffle {
  color: var(--primaryColor);
}

.repeat {
  position: relative;
}

.repeat span {
  font-size: 10px;
  position: absolute;
  bottom: 0;
  right: -10px;
}

.queue-list {
  width: 300px;
  height: calc(100% - 80px);
  position: fixed;
  top: 0;
  right: 0;
  /* background-color: rgba(36, 37, 37, 0.95); */
  background-color: var(--navBG);
  /* padding: 1em; */
  overflow: hidden;
  /* background-color: ; */
  /* border: 1px solid red; */
  box-shadow: 0 -5px 10px 0 rgba(0, 0, 0, 0.2);
  padding-right: 0.5em;
  right: -300px;
  transition: 300ms ease-in-out;
  z-index: 9;
}

.open-queue .queue-list {
  right: 0;
}

.queue-list .queue-scroller {
  /* border: 1px solid red; */
  width: 100%;
  height: calc(100% - 50px);
  overflow-y: auto !important;
  overflow-x: hidden;
  padding: 1em 0;
}

.queue-list .headline {
  height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--primaryColor);
  font-weight: bold;
  padding: 0em 3em 0 2em;
  /* border: 1px solid red; */
}

.queue-list .headline > div {
  display: flex;
  align-items: center;
  font-size: 14px;
}

.queue-list .headline .len {
  margin-left: 0.5em;
  font-size: 12px;
}

.queue-list ul {
  width: 100%;
  /* height: 100%; */
  font-weight: 600;
  font-size: 12px;
  /* border: 1px solid red; */
  /* overflow: hidden; */
  /* color: #fff; */
}

.queue-list ul li {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0.2em 0;
  padding: 1em 2em;
  cursor: pointer;
}

.queue-list ul li:hover {
  background-color: var(--transColor);
}

.queue-list ul li .left-list,
.queue-list ul li .right-list {
  display: flex;
  align-items: center;
  /* flex-direction: column; */
}

.queue-list ul li .left-list {
  width: calc(100% - 50px);
}

.queue-list ul li .left-list span:first-child {
  /* width: 50px; */
  padding-right: 1em;
}

.queue-list ul li .right-list {
  display: flex;
  justify-content: space-between;
}

.queue-list ul li .right-list span {
  font-size: 10px;
  display: block;
}

/* .queue-list ul li .left-list span:last-child {
  width: calc(100% - 50px);
} */

.queue-list ul li .right-list {
  width: 50px;
  padding-left: 1em;
  /* border: 1px solid red; */
}

ul li .left-list .list-title {
  display: flex;
  flex-direction: column;
  /* border: 1px solid blue; */
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

ul li .left-list .list-title span {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}

ul li .left-list .list-title span:last-child {
  color: var(--fontColor);
  font-size: 10px;
}

.playing {
  color: var(--primaryColor);
  /* background-color: var(--transColor); */
}

.remove-queue {
  padding: 1em;
  /* border: 1px solid red; */
  margin-left: 0.2em;
}

.remove-queue i {
  font-size: 1.45em;
}

.remove-queue:hover i {
  color: var(--primaryColor);
}

.open-queue .queue-overlay {
  width: calc(100% - 0px);
  height: calc(100% - 80px);
  position: fixed;
  right: 0;
  top: 0;
  /* background-color: var(--transColor); */
  z-index: 2;
  /* border: 1px solid red; */

  /* opacity: 0; */
}

.close-queue {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5em;
  cursor: pointer;
  box-shadow: 0 0 0 10px rgba(0, 0, 0, 0.2);
  border-radius: 50%;
  transform: scale(0.8);
}

/* .close-queue * {
  border: 1px solid red;
} */

.ll {
  font-size: 10px;
  color: var(--fontColor);
  font-weight: bold;
}
</style>
