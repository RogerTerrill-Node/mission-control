<template>
  <div class="tab" :class="{quadrat:armed}" v-show="visible">
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Tab',
  props: ['title', 'armed'],
  data: () => ({
    visible: false
  })
}
</script>

<style scoped>
.tab {
  border: 1px solid black;
  background: white;
  height: 40vh;
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
