<template>
  <div class="now-playing">
    <button @click="openDir">Open Directory</button>
  </div>
</template>

<script>
import os from "os";
import path from "path";
import { ipcRenderer } from "electron";
export default {
  name: "Nowplaying",
  methods: {
    openDir() {
      console.log("Running....");
      ipcRenderer.send("open-file-dialog");
    }
  },
  mounted() {
    // ipcRenderer.on("selected-directory", (event, path) => {
    //   console.log(path);
    // });
  }
};
</script>

<style>
.now-playing {
  width: 100%;
  height: 100%;
  position: absolute;
  background-color: var(--primaryColor);
  z-index: 99;
  margin-top: 50px;
  visibility: hidden;
  opacity: 0;
  transition: 300ms ease-in-out;
  transform: scale(0.5);
  /* display: none; */
}
.is-active {
  margin-top: 0;
  visibility: visible;
  opacity: 1;
  transform: scale(1);
}
</style>
