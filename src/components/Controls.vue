<template>
  <div id="controls">
    <Analyser/>
    <Player/>
  </div>
</template>

<script>
import Analyser from "./Controls/Analyser";
import Player from "./Controls/Player";
export default {
  name: "controls",
  components: { Analyser, Player }
};
</script>

<style scoped>
#controls {
  position: fixed;
  width: 100%;
  height: 80px;
  bottom: 0;
  left: 0;
  z-index: 99;
}

/* @media (max-width: 1100px) {
  #controls {
    width: 1100px;
  }
} */
</style>
