<template>
  <div class="analyzer">
    <canvas id="analyser_render"></canvas>
  </div>
</template>

<script>
let canvas,
  ctx,
  ctx2,
  source,
  analyser,
  fbc_array,
  bars,
  bar_x,
  bar_width,
  bar_height,
  context;
export default {
  methods: {
    init(audio) {
      context = new AudioContext();
      analyser = context.createAnalyser();
      canvas = document.getElementById("analyser_render");
      ctx = canvas.getContext("2d");
      source = context.createMediaElementSource(audio);
      source.connect(analyser);
      analyser.connect(context.destination);
      this.frameLooper();
    },
    frameLooper() {
      window.requestAnimationFrame(this.frameLooper);
      fbc_array = new Uint8Array(analyser.frequencyBinCount);
      analyser.getByteFrequencyData(fbc_array);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = "#20d762";

      bars = 5000;
      for (var i = 0; i < bars; i++) {
        bar_x = i * 1;
        bar_width = 1;
        bar_height = -(fbc_array[i] / 2);
        ctx.fillRect(bar_x, canvas.height, bar_width, bar_height);
      }
    }
  },

  mounted() {
    this.$root.$on("audio-play", data => {
      this.init(data);
    });
  }
};
</script>

<style scoped>
#analyser_render {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background-color: var(--navBG);
  /* background-color: rgba(0, 0, 0, 0.5); */
}
</style>
