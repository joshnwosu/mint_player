import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    // {
    //   path: "/",
    //   name: "Songs",
    //   component: require("@/components/pages/Songs").default
    // },
    // {
    //   path: "/Local",
    //   name: "Local",
    //   component: require("@/components/pages/Local").default
    // },
    // {
    //   path: "/Equalizer",
    //   name: "Equalizer",
    //   component: require("@/components/pages/Equalizer").default
    // },
    // {
    //   path: "/Search",
    //   name: "Search",
    //   component: require("@/components/pages/Search").default
    // },
    // {
    //   path: "/Settings",
    //   name: "Settings",
    //   component: require("@/components/pages/Settings").default
    // },
    // {
    //   path: "*",
    //   redirect: "/"
    // }
  ],
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active'
})
