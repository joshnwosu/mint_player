<template>
  <div class="search music-list">
    <div class="search-nav">
      <span class="back">
        <span @click="back" class="left">
          <i class="ion-chevron-left"></i>
        </span>
      </span>

      <span class="back">
        <span class="len" v-if="searchCount > 0">
          <p>Search Result:</p>
          <p>{{searchCount}}</p>
        </span>
      </span>
    </div>
    <div class="search-list">
      <div class="empty" v-if="!searchCount > 0">
        <h1>
          <i class="fa fa-search"></i>
          Search Music
        </h1>
      </div>
      <div
        class="music"
        v-for="(music, index) in getSearch"
        :key="index"
        ref="musicItem"
        @click="select(music.id)"
        :class="{ playing: getCurrentId === music.id }"
      >
        <span class="index" v-if="getCurrentId !== music.id">{{index+1}}</span>
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
        <span class="artist">{{music.artist}}</span>
        <span class="album">{{music.album}}</span>
        <span class="genre">{{music.genre[0]}}</span>
        <span class="year">{{music.year}}</span>
        <span class="duration">{{music.duration}}</span>
      </div>
    </div>
  </div>
  <!-- </div> -->
</template>

<script>
import { mapGetters, mapActions, mapMutations } from "vuex";
export default {
  name: "Search",
  computed: {
    ...mapGetters(["getSearch", "allMusic", "getCurrentId", "searchCount"])
  },
  methods: {
    ...mapActions(["SELECT_MUSIC_ACT", "SEARCH_LIST"]),
    ...mapMutations(["SET_PLAYLIST"]),
    back() {
      let views = document.querySelectorAll(".views > div");
      let widget = document.querySelector(".nav-links");
      let tabs = widget.querySelectorAll("li a");

      tabs.forEach(tab => {
        tab.classList.remove("tab-active");
      });
      tabs[1].classList.add("tab-active");

      views.forEach(view => {
        view.classList.remove("tab-content-active");
      });
      views[1].classList.add("tab-content-active");
    },
    select(id) {
      if (id != undefined) {
        if (this.getSearch.length) {
          this.SET_PLAYLIST(this.getSearch.slice(0));
        }
      }
      this.SELECT_MUSIC_ACT(id);
    }
  },
  mounted() {
    this.SEARCH_LIST();
  }
};
</script>

<style>
.music-scroller {
  /* margin-top: 0 !important; */
}
.search-list {
  /* border: 1px solid blue; */
  height: calc(100% - 50px);
  border-top: 2px solid var(--navBG);
  padding: 0 1em;
  height: calc(100% - 42px);
  overflow-y: auto;
  transition: 300ms linear;
  padding-bottom: 1em;
}
.search-nav {
  height: 50px;
  /* border-bottom: 2px solid var(--navBG); */
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 2em;
  color: var(--primaryColor);
  font-size: 14px;
  background-color: var(--navBG);
}

.search-nav .back {
  display: flex;
}

.search-nav .back > * {
  display: flex;
  margin-right: 1em;
}
.back .left {
  /* font-size: 1.4em; */
  cursor: pointer;
  padding: 0.2em;
}

.back .len {
  display: flex;
  align-items: center;
}

.back .len p {
  margin-right: 0.5em;
  font-size: 1em;
}

.empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  /* border: 1px solid red; */
}

.empty h1 {
  color: var(--transColor);
  font-size: 1em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.empty h1 i {
  margin-bottom: 0.1em;
  font-size: 4vw;
}
</style>
