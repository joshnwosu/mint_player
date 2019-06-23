<template>
  <div class="date">
    <div class="nav-headline">
      <p>Date</p>
      <div class="stamp">
        <span>{{day}}</span>
        <span>{{month}}</span>
        <span>{{date}}</span>
        <span>{{year}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Date",
  data() {
    return {
      day: "",
      month: "",
      date: "",
      year: ""
    };
  },
  created() {
    let weeks = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    let today = new Date();
    var dy = weeks[String(today.getDay())];
    var dd = String(today.getDate()).padStart(2, "0");
    var mm = String(today.getMonth() + 1).padStart(2, "0"); //January is 0!
    var yyyy = today.getFullYear();
    this.day = dy;
    this.month = mm;
    this.date = dd;
    this.year = yyyy;
  }
};
</script>

<style scoped>
.stamp {
  display: flex;
  flex-wrap: nowrap;
  margin-top: 1em;
  cursor: default;
}

.stamp span {
  display: inline-block;
  /* border: 1px solid red; */
  padding: 1em;
  border-radius: 3px;
  /* box-shadow: 0 2px 20px 0 rgba(0, 0, 0, 0.2); */
  color: var(--headlineColor);
  margin-right: 0.4em;
}

.stamp span {
  background-color: var(--bgColor);
}

.stamp span:first-child {
  background-color: var(--primaryColor);
  color: #fff;
}
</style>
