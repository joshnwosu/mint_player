<template>
  <div class="views">
    <Search/>
    <Songs/>
    <Favorite/>
  </div>
</template>

<script>
import Songs from "./pages/Songs";
import Favorite from "./pages/Favorite";
import Search from "./pages/Search";
export default {
  name: "Views",
  components: { Songs, Favorite, Search }
};
</script>

<style>
.views {
  width: 100%;
  height: 100%;
  padding: 1em;
  position: absolute;
  /* border: 1px solid red; */
}

.views > div {
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  /* border: 1px solid green; */
  visibility: hidden;
  opacity: 0;
  margin-top: 50px;
  transition: 300ms ease-in-out;
}

.views .tab-content-active {
  visibility: visible;
  opacity: 1;
  margin-top: 0px;
}
</style>
