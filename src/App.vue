<template>
  <div id="app">
    <div :key="index" v-for="(el, index) in $vuenotify.items">
      <transition name="fade">
        <p style="font-size: 50px;" v-if="el.isStatus('pending')">
          {{el.value}}
        </p>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({
  mounted () {
    this.$vuenotify.createItem({test: 1}, 1000)
    this.$vuenotify.createItem({test: 2}, 1000)
    this.$vuenotify.createItem({test: 3}, 1000)
    this.$vuenotify.createItem({test: 4}, 1000)
    this.$vuenotify.run()
    console.log(this.$vuenotify.items)
    setTimeout(() => {
      this.$vuenotify.stop()
      this.$vuenotify.createItem({test: 5}, 1000)
      console.log(this.$vuenotify.items)
      this.$vuenotify.run()
    }, 6000)
  }
})
export default class App extends Vue {}
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
</style>
