<template>
  <div id="app">
    <header>
      <span class="header-item title" @click="openRepository">Maze</span>
      <span class="header-item best">{{bestTime}}</span>
      <select class="header-item difficulty" v-model="difficulty">
        <option value="easy">Easy</option>
        <option value="normal">Normal</option>
        <option value="hard">Hard</option>
      </select>
    </header>
    <main>
      <maze :difficulty="difficulty"></maze>
    </main>
  </div>
</template>

<script>
import Maze from 'vue-maze'

export default {
  name: 'app',
  components: {
    Maze
  },
  data () {
    return {
      difficulty: 'normal',
      bestTimes: {
        easy: null,
        normal: null,
        hard: null
      },
      current: null
    }
  },
  computed: {
    bestTime () {
      return this.bestTimes[this.difficulty]
    }
  },
  methods: {
    openRepository () {
      window.open('https://github.com/meganetaaan/maze')
    },
    onStart: function () {
      this.startTime = Date.now()
    },
    onFinish: function () {
      this.time = Date.now() - this.startTime
    },
    onInit: function () {
      this.startTime = 0
    }
  }
}
</script>

<style>
body {
  margin: 0;
}

#app {
  position: absolute;
  height: 100%;
  width: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  position: absolute;
  top: 56px;
  height: calc(100% - 56px);
  width: 100%;
  text-align: center;
}

.maze {
  width: 100%;
  height: 100%;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
  display: flex;
}

.header-item {
  font-size: 20px;
  flex-grow: 1;
}

.title {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
  cursor: pointer;
}

.difficulty {
  max-width: 200px;
  flex-grow: 0;
  margin: 0 2;
}

mazeControl {
  position: absolute;
  top: 15px;
  left: 120px;
}
</style>
