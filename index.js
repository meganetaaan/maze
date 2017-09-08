// import Maze from './mazeCanvas.js'
let seed = 0;
let handle;

const namePrefix = "maze";
var Module = {
  preRun: [],
  postRun: [],
  wasmBinaryFile: `${namePrefix}.wasm`,
  noInitialRun: true, // don't run `fn main()`. but we can call `pub fn add(a: i32, b: i32) -> i32`.
  print: text => {
    console.log(text);
  },
  printErr: text => {
    console.warn(text);
  }
};
fetch(`${namePrefix}.wasm`)
  .then(resp => resp.arrayBuffer())
  .then(ab => {
    Module.wasmBinary = ab;
    return new Promise(resolve => {
      const script = document.createElement("script");
      script.src = `${namePrefix}.js`;
      script.addEventListener("load", resolve);
      document.body.appendChild(script);
    });
  })
  .then(() => {
    const wasm_array_to_js = Module.cwrap("wasm_array_to_js", null, [
      "number",
      "number",
      "number",
      "number",
      "number"
    ]);
    const buttonEl = document.querySelector("#execBtn");
    if (buttonEl != null) {
      buttonEl.addEventListener("click", spawnMazeBySize);
    }
    window.addEventListener('resize', () => {
      if (handle != null) {
        clearTimeout(handle)
      }
      handle = setTimeout(fillWindowWithMaze, 500)
    })
    fillWindowWithMaze();

    function spawnMazeBySize() {
      const size = Number(document.getElementById("size").value);
      const container = document.getElementById("canvasContainer");
      const lx = size;
      const ly = lx;
      injectMaze(container, lx, ly);
    }

    function fillWindowWithMaze() {
      const container = document.getElementById("canvasContainer");
      const width = container.clientWidth - 12;
      const height = container.clientHeight - 12;
      const cellWidth = 10;
      const cellHeight = 10;
      const lx = Math.floor(width / cellWidth);
      const ly = Math.floor(height / cellHeight);
      injectMaze(container, lx, ly, { cellWidth, cellHeight });
    }

    function injectMaze(elem, lx, ly, opt) {
      elem.innerHTML = "";
      const bondHSize = (lx + 1) * ly;
      const bondVSize = (ly + 1) * lx;
      const len = bondHSize + bondVSize;
      const bufsize = len * 4;
      const bufptr = Module._malloc(bufsize);
      Module._memset(bufptr, 0, bufsize);
      let buf = new Float32Array(Module.HEAPF32.buffer, bufptr, len);
      window.performance.mark("wasm_call.begin");
      wasm_array_to_js(len, buf.byteOffset, lx, ly, seed++);
      window.performance.mark("wasm_call.end");
      window.performance.measure(
        "wasm_call",
        "wasm_call.begin",
        "wasm_call.end"
      );
      console.log(window.performance.getEntriesByType("measure"));
      Module._free(bufptr);

      const maze = new Maze(lx, ly, opt);
      // TODO: maze側の責務にする
      // 縦線の描画
      maze.beginPath()
      maze.setColor('#FF9800', '#222')
      maze.drawCircle(0, 0)
      maze.setColor('#4CAF50', '#222')
      maze.drawCircle(lx - 1, ly - 1)
      maze.setColor(null, '#222')
      for (let i = 0; i < bondHSize; i++) {
        if (buf[i] !== 0) {
          continue;
        }
        const x1 = i % (lx + 1);
        const y1 = Math.floor(i / (lx + 1));
        const x2 = x1;
        const y2 = y1 + 1;
        maze.drawLine(x1, y1, x2, y2);
      }
      // 横線の描画
      for (let j = bondHSize; j < len; j++) {
        if (buf[j] !== 0) {
          continue;
        }
        const i = j - bondHSize;
        const x1 = i % lx;
        const y1 = Math.floor(i / lx);
        const x2 = x1 + 1;
        const y2 = y1;
        maze.drawLine(x1, y1, x2, y2);
      }
      maze.stroke();
    }
  });
