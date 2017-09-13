<template>
  <div class="maze">
    <canvas v-if="ready" class="maze-canvas" :width="width" , :height="height"></canvas>
    <span v-else>{{lx}} {{ly}} loading...</span>
  </div>
</template>

<script>
export default {
  name: 'maze',
  data () {
    return {
      ready: false,
      ctx: null,
      width: null,
      height: null,
      cellWidth: 10,
      cellHeight: 10,
      margin: 5
    }
  },
  mounted (vm) {
    this.height = this.$el.offsetHeight
    this.width = this.$el.offsetWidth
  },
  computed: {
    lx () {
      return Math.max(1, Math.ceil((this.width - this.margin * 2) / this.cellWidth))
    },
    ly () {
      return Math.max(1, Math.floor((this.height - this.margin * 2) / this.cellHeight))
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
