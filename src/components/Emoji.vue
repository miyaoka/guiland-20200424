<template>
  <div>
    <section v-for="(val, emojiType) in codePoints" :key="emojiType">
      <h2>{{ emojiType }}</h2>
      <span
        v-for="code in getListByType(emojiType)"
        :key="code"
        class="emoji"
        @click="() => copyCode(code)"
        >{{ String.fromCodePoint(code) }}</span
      >
    </section>
    <div>
      <h2>test</h2>
      <span
        v-for="code in getCodeList(120000, 10000)"
        :key="code"
        class="emoji"
        @click="() => copyCode(code)"
        >{{ String.fromCodePoint(code) }}</span
      >
    </div>
    <div class="debug">
      <p>{{ selectedCode }}</p>
      <p>{{ String.fromCodePoint(selectedCode) }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

const codePoints: Record<string, [number, number][]> = {
  face: [
    [0x1f600, 69],
    [129296, 8],
    [129312, 16],
    [129332, 3],
    [129392, 1],
    [129395, 4],
    [129402, 1],
    [129464, 2],
    [129488, 7],
  ],
  hand: [
    [128070, 11],
    [128400, 1],
    [128405, 2],
    [129304, 8],
  ],
}

export default Vue.extend({
  props: {},
  data() {
    return {
      selectedCode: 0,
      inputString: '',
    }
  },
  computed: {
    codePoints(): Record<string, [number, number][]> {
      return codePoints
    },
  },
  methods: {
    getListByType(type: string) {
      const vals = codePoints[type]
      if (!vals) return []
      return vals.map((val) => this.getCodeList(...val)).flat()
    },
    getCodeList(first: number, length: number) {
      return [...new Array(length)].map((_, i) => first + i)
    },
    copyCode(code: number) {
      this.selectedCode = code
    },
    emojiToCode(emoji: string) {
      let comp
      if (emoji.length === 1) {
        comp = emoji.charCodeAt(0)
      }
      comp =
        (emoji.charCodeAt(0) - 0xd800) * 0x400 +
        (emoji.charCodeAt(1) - 0xdc00) +
        0x10000
      if (comp < 0) {
        comp = emoji.charCodeAt(0)
      }
      return comp.toString(16)
    },
  },
})
</script>

<style scoped lang="scss">
.emoji {
  cursor: pointer;
  &:hover {
    outline: 1px solid #f00;
  }
}
.debug {
  padding: 10px;
  background: rgba(0, 0, 0, 0.5);
  color: #fff;
  position: fixed;
  right: 0;
  top: 0;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
