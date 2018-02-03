<template>
  <div id="app">
    <transition name="pop">
      <div class="overlay" v-if="finished">
        <div class="modal">
          <div class="modal-content">
            <div class="message">
              <div class="finish">FINISH!!</div>
              <div class="you-scored">You scored</div>
              <div class="score">{{formatTime(score)}}</div>
              <div class="you-scored">in {{difficulty}} mode!!</div>
            </div>
            <div class="buttons">
              <!-- <button val="share">SHARE</button> -->
              <button val="next" @click="onClickNext">PLAY AGAIN</button>
              <!-- Place this tag where you want the button to render. -->
              <gh-btns-star slug="meganetaaan/vue-maze" show-count></gh-btns-star>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <header>
      <span class="header-item title" @click="openRepository">Maze</span>
      <span class="header-item time">{{formatTime(time)}}</span>
      <span class="header-item best">{{bestTime}}</span>
      <select class="header-item strategy" v-model="strategy">
        <option value="cluster">Cluster</option>
        <option value="dig">Dig</option>
      </select>
      <select class="header-item difficulty" v-model="difficulty">
        <option value="easy">Easy</option>
        <option value="normal">Normal</option>
        <option value="hard">Hard</option>
      </select>
    </header>
    <main>
      <maze
      :difficulty="difficulty"
      :strategy="strategy"
      @start="onStart"
      @finish="onFinish"
      @init="onInit"
      ></maze>
    </main>
  </div>
</template>

<script>
import Maze from '../../vue-maze/dist/vue-maze'
import TimerMixin from 'vue-timer-mixin'
import imagePath from './runner.png'

const mixin = new TimerMixin({
  start: 'gameStart',
  stop: 'gameFinish',
  reset: 'gameInit',
  tick: 33
})

export default {
  name: 'app',
  components: {
    Maze
  },
  mixins: [
    mixin
  ],
  data () {
    return {
      strategy: 'dig',
      difficulty: 'easy',
      bestTimes: {
        easy: null,
        normal: null,
        hard: null
      },
      current: null,
      score: 0,
      finished: false,
      imagePath: imagePath
    }
  },
  computed: {
    bestTime () {
      return this.bestTimes[this.difficulty]
    }
  },
  methods: {
    openRepository () {
      window.open('https://github.com/meganetaaan/vue-maze')
    },
    formatTime: function (msec) {
      let ms = msec % 1000
      let sec = Math.floor(msec / 1000)
      let minute = Math.floor(sec / 60)
      ms = String(ms).padStart(3, '0')
      sec = String(sec % 60).padStart(2, '0')
      minute = String(minute).padStart(2, '0')
      return `${minute}:${sec}.${ms}`
    },
    onStart: function () {
      this.$emit('gameStart')
    },
    onFinish: function () {
      this.score = this.time
      this.finished = true
      this.$emit('gameFinish')
    },
    onInit: function () {
      this.$emit('gameInit')
    },
    onClickNext: function () {
      this.finished = false
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
  align-items: center;
  box-shadow: 0 1.5px 3px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
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
  cursor: pointer;
}

.time {
  max-width: 200px;
  flex-grow: 0;
  margin: 0 2;
}

.strategy {
  max-width: 200px;
  flex-grow: 0;
  margin: 0 2;
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

.overlay {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0);
  z-index: 10;
}

.finish {
  font-size: 1.2em;
  font-weight: bold;
  color: #222;
}

.modal {
  background-color: #F8F8F8;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  z-index: 11;
  color: #666;
}

.modal-content {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-size: 2em;
  padding: 12px 20px;
}

.score {
  font-size: 0.7em;
}

.you-scored {
  font-size: 0.7em;
}

.buttons {
  display: flex;
}

.pop-enter-active {
  animation: pop-in .4s;
}
.pop-leave-active {
  animation: pop-in .4s reverse;
}
@keyframes pop-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}
</style>
