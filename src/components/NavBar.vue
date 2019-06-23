<template>
  <div class="nav-bar" ref="navBar">
    <!-- <div class="nav-contents"> -->
    <Date/>
    <div class="nav-contents">
      <div>
        <Library/>
      </div>
    </div>

    <!-- </div> -->

    <div class="close-nav" @click="closeNav">
      <span>
        <i class="ion-chevron-left"></i>
      </span>
    </div>
  </div>
</template>

<script>
import Date from "./Navbar/Date";
import Library from "./Navbar/Library";
export default {
  name: "NavBar",
  components: { Date, Library },
  methods: {
    closeNav() {
      // alert("Bar");
      let bar = this.$refs.navBar;
      bar.classList.toggle("not-opened");
    },
    init() {
      let widget = document.querySelector(".nav-links");
      let tabs = widget.querySelectorAll("li a");
      let views = document.querySelectorAll(".views > div");

      tabs.forEach(tab => {
        tab.addEventListener("click", function(e) {
          e.preventDefault();

          let index = tab.attributes["data-index"].value;

          tabs.forEach(tab => {
            tab.classList.remove("tab-active");
          });

          views.forEach(view => {
            view.classList.remove("tab-content-active");
          });

          tab.classList.add("tab-active");
          views[index].classList.add("tab-content-active");
        });
      });
    }
  },
  mounted() {
    this.init();
  }
};
</script>

<style>
.nav-bar {
  width: 250px;
  height: calc(100vh - 70px);
  padding-left: 3px;
  background-color: var(--navBG);
  position: relative;
  /* overflow-x: hidden; */
  /* overflow-y: hidden; */
  padding-right: 0.4em;
  display: flex;
  flex-direction: column;
  transition: 300ms ease-in-out;
  /* display: none; */
  box-shadow: inset 0px 0px 5px 0 rgba(0, 0, 0, 0.1);
  /* border: 1px solid red; */
}
.nav-bar.not-opened {
  /* transform: translateX(-220px); */
  margin-left: -223px;
  box-shadow: none;
}
.nav-contents {
  width: 210px;
  border-top: 10px solid var(--navBG);
  overflow-y: auto;
  overflow-x: hidden;
  z-index: 1;
  margin-bottom: 10px;
  /* border: 1px solid red; */
}
.nav-contents > div {
  padding: 0 10px;
}
.nav-headline {
  font-size: 12px;
  color: var(--headlineColor);
  text-transform: uppercase;
  font-weight: bold;
  margin-top: 1em;
  position: relative;
}

.nav-headline,
.nav-links li a {
  padding: 0.5em 2em;
  /* margin: 1em 0; */
}

.nav-links li a {
  color: var(--fontColor);
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  /* padding: 0.5 1em; */
  border-left: 2px solid transparent;
  margin: 0.5em 0;
}

.nav-links li a i {
  display: block;
  width: 30px;
  color: var(--primaryColor);
  font-size: 18px;
}

.nav-links li:hover {
  background-color: var(--transColor);
}

.close-nav {
  width: 50px;
  height: 50px;
  background-color: var(--bgColor);
  padding: 0.7em;
  display: flex;
  align-items: center;
  border-radius: 50%;
  color: var(--primaryColor);
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: -25px;
  cursor: pointer;
  z-index: 1;
  box-shadow: 0px 0px 5px 0 rgba(0, 0, 0, 0.1);
  /* border: 1px solid red; */
}

.nav-bar.not-opened .close-nav {
  box-shadow: none;
}

/* active link class */
.tab-active,
.active,
.exact-active {
  background-color: var(--transColor);
  border-color: var(--primaryColor) !important;
  background: linear-gradient(
    45deg,
    var(--transColor),
    transparent,
    transparent
  );
}
</style>


