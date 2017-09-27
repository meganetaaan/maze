import Vue from 'vue'
import Vuex from 'vuex'
import wasm from './rust/maze.rs'

let getMaze = null
let wasmArrayToJs = null
let seed = Date.now()

Vue.use(Vuex)
const OPERATION = {
  SET_MAZE: 'setMaze',
  SET_PLAYER: 'setPlayer'
}

const store = new Vuex.Store({
  state: {
    lx: null,
    ly: null,
    bonds: [],
    player: {
      id: '00',
      x: 0,
      y: 0
    }
  },
  getters: {
    getBondH: state => () => {
      return state.bonds.slice(0, (state.lx + 1) * state.ly)
    },
    getBondV: state => () => {
      return state.bonds.slice(-state.lx * (state.ly + 1))
    }
  },
  actions: {
    async movePlayerBy (arg, payload) {
      const param = { x: this.state.player.x + payload.x, y: this.state.player.y + payload.y }
      await this.movePlayerTo(arg, param)
    },
    async movePlayerTo ({ commit }, payload) {
      const id = payload.id
      const x = payload.x
      const y = payload.y
      commit(OPERATION.SET_PLAYER, {id, x, y})
    },
    async update ({ commit }, payload) {
      if (getMaze == null) {
        const moduleParam = {
          preRun: [],
          postRun: [],
          noInitialRun: true, // don't run `fn main()`. but we can call `pub fn add(a: i32, b: i32) -> i32`.
          print: text => {
            console.log(text)
          },
          printErr: text => {
            console.warn(text)
          }
        }
        const module = await wasm.initialize(moduleParam)
        getMaze = function (lx, ly) {
          wasmArrayToJs = module.cwrap('wasm_array_to_js', null, ['number', 'number', 'number', 'number', 'number'])
          const bondHSize = (lx + 1) * ly
          const bondVSize = (ly + 1) * lx
          const len = bondHSize + bondVSize
          const bufsize = len * 4
          const bufptr = module._malloc(bufsize)
          module._memset(bufptr, 0, bufsize)
          let buf = new Float32Array(module.HEAPF32.buffer, bufptr, len)
          window.performance.mark('wasm_call.begin')
          wasmArrayToJs(len, buf.byteOffset, lx, ly, seed++)
          return buf
        }
      }
      const lx = payload.lx
      const ly = payload.ly
      const buf = getMaze(lx, ly)
      commit(OPERATION.SET_MAZE, { lx, ly, bonds: Array.from(buf) })
    }
  },
  mutations: {
    setMaze (state, payload) {
      state.lx = payload.lx
      state.ly = payload.ly
      state.bonds.splice(payload.bonds.length)
      for (let i = 0; i < payload.bonds.length; i++) {
        Vue.set(state.bonds, i, payload.bonds[i])
      }
    },
    setPlayer (state, payload) {
      state.player.x = payload.x
      state.player.y = payload.y
    }
  }
})

export default store
