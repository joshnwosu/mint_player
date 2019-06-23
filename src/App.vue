<template>
  <div id="app">
    <NavBar/>
    <Nowplaying/>
    <div id="container">
      <Header/>
      <div class="content">
        <!-- <router-view/> -->
        <Views/>
      </div>
    </div>
    <Controls/>
  </div>
</template>

<script>
import Views from "./components/Views";
import Controls from "./components/Controls";
import NavBar from "./components/NavBar";
import Header from "./components/Header";
import Nowplaying from "./components/Nowplaying";
import path from "path";

import { mapGetters, mapActions } from "vuex";
export default {
  name: "app",
  components: {
    Views,
    Controls,
    NavBar,
    Header,
    Nowplaying
  },

  methods: {
    ...mapActions(["GET_MUSIC_FILES"])
  },

  mounted() {
    this.GET_MUSIC_FILES();
  }
};
</script>

<style>
/* @import "./assets/css/ionicons.min.css"; */
*,
*::after,
*::before {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  outline: none;
  user-select: none;
  list-style-type: none;
  text-decoration: none;
}

body {
  font-family: "Lato";
  background-color: var(--bgColor);
  color: var(--headlineColor);
  overflow: hidden !important;
  /* overflow-x: auto; */
}

::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: transparent;
  border-radius: 5px;
  margin-left: 1em;
}

::-webkit-scrollbar-thumb {
  background-color: var(--primaryColor);
  border-radius: 5px;
}

::-webkit-scrollbar-button {
  background-color: transparent;
}

#app {
  width: 100%;
  /* max-width: 100%; */
  display: flex;
  /* flex-direction: row; */
  /* flex-wrap: nowrap; */
  /* justify-content: space-between; */
  padding-right: 0.4em;
  /* border: 1px solid red; */
  position: relative;
}

/* @media (max-width: 1100px) {
  #app {
    width: 1100px;
  }
} */

#container {
  position: relative;
  /* width: calc(100% - 250px); */
  /* width: 100%; */
  width: 100%;
  height: 100vh;
  /* border: 1px solid blue; */
  z-index: 5;
}

.content {
  /* border-top: 1px solid var(--contentTopColor); */
  /* padding: 1em; */
  margin-top: 60px;
  overflow-y: auto;
  width: 100%;
  height: calc(100% - 140px);
  position: absolute;
  overflow: hidden;
  background-color: var(--bgColor);
}

/* media screen */
@media (max-width: 1200px) {
  .next-up,
  .previous-up {
    display: none !important;
    border: 1px solid blue;
  }
}
</style>
