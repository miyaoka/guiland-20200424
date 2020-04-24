<template>
  <div>
    <input v-model.number="count" type="number" @change="init" />

    <div class="canvas" :style="canvasStyle">
      <div
        v-for="agent in agentList"
        :key="agent.id"
        class="agent"
        :style="getAgentStyle(agent)"
      >
        {{ String.fromCodePoint(agent.code) }}
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { getRandomFaceCode } from '@/utils/emoji'

type Vector = {
  x: number
  y: number
}

type Point = {
  x: number
  y: number
}

type Agent = {
  id: number
  code: number
  pt: Point
  vec: Vector
}

// 三密
// const getAlignment = () => {}

// const getCohesion = () => {}

// // Social Distancing
// const getSeparation = () => {}

const toPx = (num: number) => `${num}px`
const dirs = ['x', 'y'] as const

export default Vue.extend({
  props: {},
  data() {
    return {
      agentList: [] as Agent[],
      count: 50,
      stage: {
        x: 800,
        y: 500,
      },
    }
  },
  computed: {
    canvasStyle(): Record<string, string> {
      return {
        width: toPx(this.stage.x),
        height: toPx(this.stage.y),
      }
    },
  },
  mounted() {
    this.init()
    this.update()
  },
  methods: {
    getAgentStyle(agent: Agent) {
      const pts = [agent.pt.x, agent.pt.y].map((pt) => toPx(pt)).join()
      return {
        transform: `translate(${pts})`,
      }
    },
    init() {
      const list = [...new Array(this.count)].map((_, i) => {
        return {
          id: i,
          code: getRandomFaceCode(),
          pt: {
            x: this.stage.x * Math.random(),
            y: this.stage.y * Math.random(),
          },
          vec: {
            x: (Math.random() - 0.5) * 5,
            y: (Math.random() - 0.5) * 5,
          },
        }
      })
      this.agentList = list
    },
    update() {
      this.agentList.forEach((agent) => {
        const pt = {
          x: agent.pt.x + agent.vec.x,
          y: agent.pt.y + agent.vec.y,
        }
        dirs.forEach((dir) => {
          if (pt[dir] < 0) {
            pt[dir] = 0
            agent.vec[dir] *= -1
            return
          }
          if (pt[dir] > this.stage[dir]) {
            pt[dir] = this.stage[dir]
            agent.vec[dir] *= -1
          }
        })

        agent.pt = pt
      })
      requestAnimationFrame(this.update)
    },
  },
})
</script>

<style scoped lang="scss">
.canvas {
  display: flex;
  background: #eee;
  border: 1px solid #ddd;
}
.agent {
  position: absolute;
  pointer-events: none;
}
</style>
