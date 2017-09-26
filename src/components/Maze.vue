<template>
  <div class="maze">
    <input v-model="x"></input>
    <div>{{x}}</div>
    <canvas ref="mazeCanvas" :width="width" :height="height"></canvas>
  </div>
</template>

<script>
import _ from 'lodash'
class Renderer {
  constructor (ctx, unitWidth, unitHeight, offset) {
    this.ctx = ctx
    this.unitWidth = unitWidth
    this.unitHeight = unitHeight
    this.offset = offset
    this.wallWidth = 2
  }

  // TODO: 境界を見直す
  clear (w, h) {
    this.ctx.clearRect(0, 0, w, h)
  }

  setColor (fill, stroke) {
    this.ctx.fillStyle = fill
    this.ctx.strokeStyle = stroke
  }

  beginPath () {
    this.ctx.beginPath()
  }

  stroke () {
    this.ctx.stroke()
  }

  drawCircle (x, y) {
    this.ctx.beginPath()
    const cx = x * this.unitWidth + this.unitWidth / 2 + this.offset
    const cy = y * this.unitHeight + this.unitHeight / 2 + this.offset
    const r = Math.min(this.unitWidth, this.unitHeight) / 2 - this.wallWidth
    this.ctx.arc(cx, cy, r, 0, 2 * Math.PI)
    this.ctx.fill()
  }

  drawLine (x1, y1, x2, y2) {
    const fromX = this.offset + x1 * this.unitWidth
    const fromY = this.offset + y1 * this.unitHeight
    const toX = this.offset + x2 * this.unitWidth
    const toY = this.offset + y2 * this.unitHeight
    this.ctx.moveTo(fromX, fromY)
    this.ctx.lineTo(toX, toY)
  }
}

export default {
  name: 'maze',
  data () {
    return {
      renderer: null,
      width: null,
      height: null,
      cellWidth: 20,
      cellHeight: 20,
      margin: 5,
      x: 0
    }
  },
  mounted (vm) {
    this.height = this.$el.offsetHeight
    this.width = this.$el.offsetWidth
    this.renderer = new Renderer(
      this.$refs.mazeCanvas.getContext('2d'),
      this.cellWidth,
      this.cellHeight,
      this.margin
    )
  },
  computed: {
    ready () {
      return this.bondH.length > 0 || this.bondV.length > 0
    },
    lx () {
      return Math.max(1, Math.floor((this.width - this.margin * 2) / this.cellWidth))
    },
    ly () {
      return Math.max(1, Math.floor((this.height - this.margin * 2) / this.cellHeight))
    },
    bondH () {
      return this.$store.getters.getBondH()
    },
    bondV () {
      return this.$store.getters.getBondV()
    },
    user () {
      return this.$store.state.user
    }
  },
  watch: {
    lx () {
      this.updateMaze()
    },
    ly () {
      this.updateMaze()
    },
    bondH () {
      this.renderMaze()
    },
    bondV () {
      this.renderMaze()
    },
    x () {
      this.$store.dispatch('moveUserTo', {x: this.x, y: 0})
    }
  },
  methods: {
    updateMaze: _.debounce(function () {
      if (this.lx > 0 && this.ly > 0) {
        this.$store.dispatch('update', {
          lx: this.lx,
          ly: this.ly
        })
      }
    }, 300),
    renderMaze: _.debounce(function () {
      const {renderer, lx, ly, bondH, bondV} = this

      renderer.clear(this.width, this.height)
      renderer.ctx = this.$refs.mazeCanvas.getContext('2d')
      renderer.setColor('#FF9800', '#222')
      renderer.drawCircle(0, 0)
      renderer.setColor('#4CAF50', '#222')
      renderer.drawCircle(lx - 1, ly - 1)
      renderer.setColor(null, '#222')

      // 縦線の描画
      renderer.beginPath()
      for (let i = 0; i < bondH.length; i++) {
        if (bondH[i] !== 0) {
          continue
        }
        const x1 = i % (lx + 1)
        const y1 = Math.floor(i / (lx + 1))
        const x2 = x1
        const y2 = y1 + 1
        renderer.drawLine(x1, y1, x2, y2)
      }

      // 横線の描画
      for (let j = 0; j < bondV.length; j++) {
        if (bondV[j] !== 0) {
          continue
        }
        const x1 = j % lx
        const y1 = Math.floor(j / lx)
        const x2 = x1 + 1
        const y2 = y1
        renderer.drawLine(x1, y1, x2, y2)
      }
      renderer.stroke()
    }, 300)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .maze {
    width: 100%;
    height: 100%;
    min-height: 50px;
    min-width: 50px;
    overflow: hidden;
  }
</style>
