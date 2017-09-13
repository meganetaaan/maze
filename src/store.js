import Vue from 'vue'
import Vuex from 'vuex'
// import getMaze from './rust/index.js'
import makeMaze from './rust/maze.wasm'

Vue.use(Vuex)
const OPERATION = {
  SET_MAZE: 'setMaze'
}

makeMaze().then(instance => {
  debugger
}).catch(err => {
  console.log(err)
  debugger
})

const store = new Vuex.Store({
  state: {
    lx: null,
    ly: null,
    bonds: []
  },
  getters: {
    getBondH: state => () => {
      return state.bonds.slice(0, (this.lx + 1) * this.ly)
    },
    getBondV: state => () => {
      return state.bonds.slice(-(this.lx + 1) * this.ly)
    }
  },
  actions: {
    async update ({commit}, payload) {
      const lx = payload.lx
      const ly = payload.ly
      const bonds = []// await getMaze()
      commit(OPERATION.SET_MAZE, {lx, ly, bonds})
    }
  },
  mutations: {
    setMaze (state, payload) {
      state.lx = payload.lx
      state.ly = payload.ly
      Vue.set(state.bonds, payload.bonds)
    }
  }
})

export default store
