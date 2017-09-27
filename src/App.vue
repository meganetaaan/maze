<template>
  <div id="app">
    <header>
      <span>Maze</span>
    </header>
    <main>
      <maze></maze>
    </main>
  </div>
</template>

<script>
import Maze from './components/Maze'

export default {
  name: 'app',
  components: {
    Maze
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

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}

mazeControl {
  position: absolute;
  top: 15px;
  left: 120px;
}
</style>
