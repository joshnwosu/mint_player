<template>
  <div id="header">
    <div class="left">
      <div class="logo">
        <img src="assets/img/cover.png" alt="cover">
        <h1>Mint</h1>
      </div>

      <div class="search-bar">
        <div class="search-field">
          <i class="ion-android-search"></i>
          <input
            type="text"
            v-model="inputValue"
            placeholder="Search"
            @input="search"
            @keydown="dosomething"
            @blur="empty"
            @focus="activeSearch"
            ref="input"
          >
          <i class="ion-close"></i>
        </div>
      </div>
    </div>

    <div class="right">
      <div class="settings">
        <span class="toggle-theme">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
            <path
              id="theme-icon"
              d="M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z"
            ></path>
          </svg>
        </span>
        <div class="switch">
          <input @change="resetTheme" class="switch__input" type="checkbox" id="themeSwitch">
          <label aria-hidden="true" class="switch__label" for="themeSwitch">On</label>
          <div aria-hidden="true" class="switch__marker"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
// import { clearTimeout, setTimeout } from "timers";

let darkIcon =
  "M12 10.999c1.437.438 2.562 1.564 2.999 3.001.44-1.437 1.565-2.562 3.001-3-1.436-.439-2.561-1.563-3.001-3-.437 1.436-1.562 2.561-2.999 2.999zm8.001.001c.958.293 1.707 1.042 2 2.001.291-.959 1.042-1.709 1.999-2.001-.957-.292-1.707-1.042-2-2-.293.958-1.042 1.708-1.999 2zm-1-9c-.437 1.437-1.563 2.562-2.998 3.001 1.438.44 2.561 1.564 3.001 3.002.437-1.438 1.563-2.563 2.996-3.002-1.433-.437-2.559-1.564-2.999-3.001zm-7.001 22c-6.617 0-12-5.383-12-12s5.383-12 12-12c1.894 0 3.63.497 5.37 1.179-2.948.504-9.37 3.266-9.37 10.821 0 7.454 5.917 10.208 9.37 10.821-1.5.846-3.476 1.179-5.37 1.179z";

let lightIcon =
  "M17 12c0 2.762-2.238 5-5 5s-5-2.238-5-5 2.238-5 5-5 5 2.238 5 5zm-5-7c.34 0 .672.033 1 .08v-2.08h-2v2.08c.328-.047.66-.08 1-.08zm-4.184 1.401l-1.472-1.473-1.415 1.415 1.473 1.473c.402-.537.878-1.013 1.414-1.415zm9.782 1.414l1.473-1.473-1.414-1.414-1.473 1.473c.537.402 1.012.878 1.414 1.414zm-5.598 11.185c-.34 0-.672-.033-1-.08v2.08h2v-2.08c-.328.047-.66.08-1 .08zm4.185-1.402l1.473 1.473 1.415-1.415-1.473-1.472c-.403.536-.879 1.012-1.415 1.414zm-11.185-5.598c0-.34.033-.672.08-1h-2.08v2h2.08c-.047-.328-.08-.66-.08-1zm13.92-1c.047.328.08.66.08 1s-.033.672-.08 1h2.08v-2h-2.08zm-12.519 5.184l-1.473 1.473 1.414 1.414 1.473-1.473c-.536-.402-1.012-.877-1.414-1.414z";
export default {
  data() {
    return {
      inputValue: "",
      temporarySearchPlaylist: this.searchList
    };
  },
  computed: {
    ...mapGetters(["playlist", "allMusic"])
  },
  methods: {
    ...mapActions(["SEARCH_LIST"]),
    activeSearch() {
      let views = document.querySelectorAll(".views > div");
      let widget = document.querySelector(".nav-links");
      let tabs = widget.querySelectorAll("li a");

      tabs.forEach(tab => {
        tab.classList.remove("tab-active");
      });
      tabs[0].classList.add("tab-active");

      views.forEach(view => {
        view.classList.remove("tab-content-active");
      });
      views[0].classList.add("tab-content-active");
    },
    dosomething({ keyCode }) {
      if (keyCode == 27) {
        this.inputValue = "";
        this.SEARCH_LIST([]);
      } else if (keyCode == 13) {
        if (this.inputValue.trim().length) {
          let searchString = this.inputValue.trim();
          this.searchTracks(searchString);
        }
      }
    },
    search() {
      let searchStr = this.inputValue.trim();
      if (!searchStr.length) {
        this.inputValue = "";
        this.temporarySearchPlaylist = "";
        this.searchTracks(searchStr);
      } else {
        if (searchStr.length) {
          this.searchTracks(searchStr);
        }
      }
    },
    searchTracks(query) {
      query = query || "";
      query = query.toLowerCase();
      this.temporarySearchPlaylist = this.allMusic.slice(0);

      if (query.length) {
        this.temporarySearchPlaylist = this.temporarySearchPlaylist.filter(
          tr => {
            if (
              tr.artist.toLowerCase().indexOf(query) != -1 ||
              tr.title.toLowerCase().indexOf(query) != -1 ||
              tr.album.toLowerCase().indexOf(query) != -1
            ) {
              return tr;
            }
          }
        );
        this.SEARCH_LIST(this.temporarySearchPlaylist);
      } else {
        this.SEARCH_LIST([]);
      }
    },
    empty() {
      let input = this.$refs.input;
      input.value = "";
    },

    initTheme() {
      let themeColor = document.querySelector("#theme-color");
      let themeIcon = document.querySelector("#theme-icon");
      let darkThemeSelected =
        localStorage.getItem("themeSwitch") !== null &&
        localStorage.getItem("themeSwitch") === "light";

      // update checkbox
      themeSwitch.checked = darkThemeSelected;
      // update body data-theme attribute
      darkThemeSelected
        ? document.body.setAttribute("data-theme", "light")
        : document.body.removeAttribute("data-theme");

      darkThemeSelected
        ? (themeColor.attributes.href.value = "./assets/themes/lightTheme.css")
        : (themeColor.attributes.href.value = "./assets/themes/darkTheme.css");

      darkThemeSelected
        ? (themeIcon.attributes.d.value = lightIcon)
        : (themeIcon.attributes.d.value = darkIcon);
    },

    resetTheme() {
      let themeColor = document.querySelector("#theme-color");
      let themeIcon = document.querySelector("#theme-icon");
      if (themeSwitch.checked) {
        // dark theme has been selected
        document.body.setAttribute("data-theme", "light");
        themeColor.attributes.href.value = "./assets/themes/lightTheme.css";
        themeIcon.attributes.d.value = lightIcon;
        localStorage.setItem("themeSwitch", "light");
      } else {
        document.body.removeAttribute("data-theme");
        localStorage.removeItem("themeSwitch");
        themeColor.attributes.href.value = "./assets/themes/darkTheme.css";
        themeIcon.attributes.d.value = darkIcon;
      }
    }
  },
  mounted() {
    this.initTheme();
  }
};
</script>

<style scoped>
i {
  color: var(--primaryColor);
}

#header {
  width: 100%;
  height: 60px;
  background-color: var(--bgColor);
  position: absolute;
  top: 0;
  right: 0;
  padding: 0 3em;
  /* border-bottom: 1px solid var(--headerBottomColor); */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.left {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  height: 100%;
  /* font-family: philosopher; */
  display: flex;
  align-items: center;
}

.logo span {
  font-size: 2em;
  color: var(--primaryColor);
}

.logo h1 {
  font-size: 1.2em;
  color: var(--primaryColor);
  margin-top: 0.2em;
  /* display: none; */
}

.logo img {
  width: 30px;
  margin-right: 0.5em;
}

.search-bar {
  margin-left: 5em;
}

.search-bar a {
  color: var(--fontColor);
}

.search-field {
  width: 400px;
  padding: 0.5em 1em;
  border-radius: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  background-color: var(--navBG);
}

.search-field input {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: transparent;
  border: none;
  padding: 0.2em 3em;
  color: var(--headlineColor);
}

::placeholder {
  color: var(--fontColor);
}

.ion-close {
  display: none;
}

.settings {
  display: flex;
  justify-content: center;
  align-items: center;
}
.settings span {
  margin-right: 0.5em;
  display: flex;
}

.settings span svg {
  fill: var(--primaryColor);
  width: 15px;
  height: 15px;
}

/* -------------------------------- 

Title: Switch
Descr: Custom ON/OFF checkbox toggle

-------------------------------- */
/*  */

.switch {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  position: relative;
  width: 64px;
  width: var(--switch-width);
  height: 32px;
  height: var(--switch-height);
  border-radius: 50em;
  padding: 3px 0;
  padding: var(--switch-padding) 0;
  /* border: 1px solid red; */
  width: 40px;
  height: 20px;
  cursor: pointer;
}

.switch__input,
.switch__label {
  position: absolute;
  left: 0;
  top: 0;
}

.switch__input {
  margin: 0;
  padding: 0;
  opacity: 0;
  height: 0;
  width: 0;
  pointer-events: none;
}

.switch__input:checked + .switch__label {
  background-color: hsl(228, 74%, 61%);
  background-color: var(--primaryColor);
  /* background-color: var(--color-primary); */
}

.switch__input:checked + .switch__label + .switch__marker {
  left: calc(100% - 19px);
  background-color: white !important;
}

.switch__label {
  width: 100%;
  height: 100%;
  color: transparent;
  user-select: none;
  background-color: hsl(240, 1%, 83%);
  background-color: var(--navBG);
  /* background-color: var(--color-contrast-low); */
  border-radius: inherit;
  z-index: 1;
  transition: background 0.2s;
  /* transition: background var(--switch-animation-duration); */
}

.switch__marker {
  position: relative;
  background-color: hsl(0, 0%, 100%);
  background-color: var(--color-white);
  background-color: var(--primaryColor);
  width: 20px;
  /* width: calc(var(--switch-height) - var(--switch-padding) * 2); */
  height: 20px;
  /* height: calc(var(--switch-height) - var(--switch-padding) * 2); */
  border-radius: 50%;
  z-index: 2;
  pointer-events: none;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.25);
  left: 0px;
  /* left: var(--switch-padding); */
  transition: left 0.2s;
  /* transition: left var(--switch-animation-duration); */
  will-change: left;
}
</style>
