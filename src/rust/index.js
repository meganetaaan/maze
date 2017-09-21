import Maze from "./mazeCanvas.js";
import createModule from "./maze.js";
let seed = 0;
let handle;
const namePrefix = "maze";

let Module = {
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

async function init() {
  return new Promise(resolveAll => {
    fetch(`${namePrefix}.wasm`)
      .then(resp => resp.arrayBuffer())
      .then(ab => {
        Module.wasmBinary = ab;
        Module = createModule(Module);
        const wasmArrayToJs = Module.cwrap("wasm_array_to_js", null, [
          "number",
          "number",
          "number",
          "number",
          "number"
        ]);
        function getMaze(lx, ly, opt) {
          const bondHSize = (lx + 1) * ly;
          const bondVSize = (ly + 1) * lx;
          const len = bondHSize + bondVSize;
          const bufsize = len * 4;
          const bufptr = Module._malloc(bufsize);
          Module._memset(bufptr, 0, bufsize);
          let buf = new Float32Array(Module.HEAPF32.buffer, bufptr, len);
          wasmArrayToJs(len, buf.byteOffset, lx, ly, seed++);
          Module._free(bufptr);
          return buf;
        }
        resolveAll(getMaze);
      });
  });
}

export default init;
