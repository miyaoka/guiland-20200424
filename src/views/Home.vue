<template>
  <div class="home">
    <h1>#金曜GUI</h1>
    <h2>emojiのなにか作る</h2>
    <Flocking />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import Flocking from '@/components/Flocking.vue'

export default Vue.extend({
  name: 'Home',
  components: {
    Flocking,
  },
})
</script>
