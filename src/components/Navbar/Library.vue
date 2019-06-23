<template>
  <div class="library">
    <div class="nav-headline">
      <p>library</p>
    </div>
    <ul class="nav-links">
      <li>
        <a href="#" data-index="0">
          <i class="ion-android-search"></i>
          <span>Search</span>
        </a>
      </li>

      <li>
        <a href="#" class="tab-active" data-index="1">
          <i class="ion-disc"></i>
          <span>Songs</span>
        </a>
      </li>

      <!-- <li>
        <a href="#" data-index="2">
          <i class="fa fa-heart"></i>
          <span>Favorite</span>
        </a>
      </li>-->
    </ul>
  </div>
</template>

<script>
export default {
  name: "Library"
};
</script>

<style scoped>
</style>
