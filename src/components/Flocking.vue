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
        <div class="range" :style="getRangeStyle()"></div>
        <div class="icon">
          {{ String.fromCodePoint(agent.code) }}
        </div>
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
  fontSize: number
}

// 三密
// const getAlignment = () => {}

// const getCohesion = () => {}

// // Social Distancing
// const getSeparation = () => {}

const toPx = (num: number) => `${num}px`
const dirs = ['x', 'y'] as const

const getDistance = (a: Agent, b: Agent) => {
  const diffs = dirs.map((dir) => Math.abs(a.pt[dir] - b.pt[dir]))
  return diffs[0] * diffs[1]
}

const getNormalize = (vec: Vector, scale: number) => {
  const norm = Math.sqrt(vec.x ** 2 + vec.y ** 2)
  return {
    x: (scale * vec.x) / norm,
    y: (scale * vec.y) / norm,
  }
}

export default Vue.extend({
  props: {},
  data() {
    return {
      agentList: [] as Agent[],
      count: 20,
      cohRange: 80,
      sepRange: 50,
      stage: {
        x: 800,
        y: 400,
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
    getRangeStyle() {
      const vals = [this.cohRange, this.cohRange]
        .map((val) => toPx(-val * 0.5))
        .join()

      return {
        width: toPx(this.cohRange),
        height: toPx(this.cohRange),
        transform: `translate(${vals})`,
      }
    },
    getAgentStyle(agent: Agent) {
      const pts = [agent.pt.x, agent.pt.y].map((pt) => toPx(pt)).join()
      return {
        fontSize: toPx(agent.fontSize),
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
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4,
          },
          fontSize: Math.random() * Math.random() * 20 + 16,
        }
      })
      this.agentList = list
    },
    getAgentListInRange(targetAgent: Agent, rangePowered: number) {
      return this.agentList.filter((agent) => {
        if (agent.id === targetAgent.id) return false
        const distance = getDistance(agent, targetAgent)
        return distance <= rangePowered
      })
    },
    calc(
      agentList: Agent[],
      target: Agent,
      rate: number,
      targetProp: 'pt' | 'vec'
    ) {
      const count = agentList.length
      if (count === 0) return

      const sum = agentList.reduce(
        (acc, agent) => {
          return {
            x: acc.x + agent[targetProp].x,
            y: acc.y + agent[targetProp].y,
          }
        },
        { x: 0, y: 0 }
      )
      const average = {
        x: sum.x / count,
        y: sum.y / count,
      }

      target[targetProp] = {
        x: target[targetProp].x + (average.x - target[targetProp].x) * rate,
        y: target[targetProp].y + (average.y - target[targetProp].y) * rate,
      }
    },
    move(agent: Agent) {
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
    },
    update() {
      this.agentList.forEach((targetAgent) => {
        const cohList = this.getAgentListInRange(
          targetAgent,
          this.cohRange ** 2
        )
        const sepList = this.getAgentListInRange(
          targetAgent,
          this.sepRange ** 2
        )

        this.calc(cohList, targetAgent, 0.01, 'vec')
        this.calc(cohList, targetAgent, 0.01, 'pt')
        // this.calc(sepList, targetAgent, -0.1, 'pt')

        this.move(targetAgent)
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
  .range {
    position: absolute;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 100%;
  }
  .icon {
    position: absolute;
    transform: translate(-50%, -50%);
  }
}
</style>
