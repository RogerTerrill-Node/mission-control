<template>
  <div class="tabs">
    <ul>
      <li
        v-for="tab in tabs"
        :key="tab.title"
        @click="clicked(tab)"
        :class="{ visible: tab.visible }"
      >{{tab.title}}</li>
    </ul>
    <slot class="quadrat"/>
  </div>
</template>

<script>
export default {
  name: 'Tabs',
  data: () => ({
    tabs: []
  }),
  methods: {
    clicked (tab) {
      const wasVisible = tab.visible
      this.tabs.forEach(tab => (tab.visible = false))
      if (!wasVisible) tab.visible = true
      if (tab.armed){
        tab.class = "quadrat"
      }
    }
  },
  created () {
    this.tabs = this.$children
  }
}
</script>

<style>
.tabs {
  border-radius: 5px;
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  position: relative;
  top: 1px;
}

li {
  background: white;
  border: 1px solid black;
  border-right: none;
  cursor: pointer;
  display: inline-block;
  padding: 10px 30px;
}

li:last-child {
  border-right: 1px solid black;
}

.visible {
  background: #ddd;
  border-bottom-color: white;
}

.quadrat {
 -webkit-animation: NAME-YOUR-ANIMATION 1s infinite; /* Safari 4+ */
  -moz-animation:    NAME-YOUR-ANIMATION 1s infinite; /* Fx 5+ */
  -o-animation:      NAME-YOUR-ANIMATION 1s infinite; /* Opera 12+ */
  animation:         NAME-YOUR-ANIMATION 1s infinite; /* IE 10+, Fx 29+ */
}

@-webkit-keyframes NAME-YOUR-ANIMATION {
0%, 49% {
    background-color: rgb(117,209,63);
    border: 3px solid #e50000;
}
50%, 100% {
    background-color: #e50000;
    border: 3px solid rgb(117,209,63);
}
}
</style>
