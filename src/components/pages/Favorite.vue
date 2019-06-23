<template>
  <div class="favorite">
    <h1>Favorite</h1>
  </div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["allMusic"])
  },
  methods: {},
  mounted() {}
};
</script>

<style>
.favorite {
  background-color: var(--bgColor);
  padding: 1em;
}
</style>
