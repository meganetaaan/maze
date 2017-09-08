const OFFSET = 5
const CELL_WIDTH = 10
const CELL_HEIGHT = 10
const WALL_WIDTH = 1
class Maze {
    constructor(lx, ly, opt = {}) {
        this._cellWidth = opt.cellWidth || CELL_WIDTH
        this._cellHeight = opt.cellHeight || CELL_HEIGHT
        this._canvas = document.createElement('canvas')
        this._canvas.classList.add('maze-canvas')
        this._canvas.height = CELL_HEIGHT * ly + OFFSET * 2
        this._canvas.width = CELL_WIDTH * lx + OFFSET * 2
        this._context = this._canvas.getContext('2d')
        document.getElementById('canvasContainer').appendChild(this._canvas)
    }

    setColor(fill, stroke) {
        this._context.fillStyle = fill
        this._context.strokeStyle = stroke
    }

    beginPath() {
        this._context.beginPath()
    }

    drawCircle(x, y) {
        this._context.beginPath()
        this._context.arc(
            x * this._cellWidth + this._cellWidth / 2 + OFFSET,
            y * this._cellHeight + this._cellHeight / 2 + OFFSET,
            Math.min(this._cellWidth, this._cellHeight) / 2 - WALL_WIDTH,
            0, 2 * Math.PI)
        this._context.fill();
    }

    drawLine(x1, y1, x2, y2) {
        this._context.moveTo(OFFSET + x1 * this._cellWidth, OFFSET + y1 * this._cellHeight)
        this._context.lineTo(OFFSET + x2 * this._cellWidth, OFFSET + y2 * this._cellHeight)
    }

    stroke() {
        this._context.stroke()
    }
}

// export default Maze;