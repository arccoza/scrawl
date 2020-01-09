import './styles.css'
import {Shape} from './shape.js'


function main() {
  var canvas = document.getElementById("canvas")
  var ctx = canvas.getContext("2d")
  var shape0 = new Shape0([20, 0, 220, 0, 200, 200, 50, 200, 0, 250], [10])
  var shape = new Shape([0, 0, 200, 0, 200, 200, 50, 200, 0, 250], [10])
  shape.o = [10, 10]
  var shapePath = new Path2D()
  var pointsPath = new Path2D()
  // var shapePath = draw(new Path2D(), shape)
  // shapePath.rect(0, 0, 50, 50)
  // shape.tfm.skewXSelf(45)
  shape.draw(shapePath)
  shape.drawPoints(pointsPath)
  // ctx.setTransform(1, 0, -1, 1, 150, 0)
  ctx.stroke(shapePath)
  ctx.fillStyle = 'rgba(255,0,0,0.5)'
  ctx.fill(pointsPath)

  // ctx.fillStyle = "rgba(255,0,0,0.5)"
  // ctx.fill(drawPoints(new Path2D(), shape, 10))
}

class Shape0 {
  constructor(p, r = [0]) {
    this.p = p
    this.r = r
    this.o = [0, 0]
  }

  get length() {
    return this.p.length / 2
  }

  get(i, withR = false) {
    i %= this.length
    var p = this.p.slice((i = i * 2), i + 2 || this.p.length)
    return [p[0] + this.o[0], p[1] + this.o[1]]
  }

  round(i) {
    return (this.r.length === 1 && this.r[0]) || this.r[i] || 0
  }

  arcp(i) {
    var r = this.round(i)
    var a = this.get(i)
    if (!r) return [...a, ...a, r]

    // var z = this.get(i - 1),
    var b = this.get(i + 1)
    return [...a, ...trace(a, b, r), r]
  }
}

function draw(ctx, shape) {
  ctx.beginPath && ctx.beginPath()
  // ctx.moveTo(...shape.get(0))
  ctx.moveTo(...trace(shape.get(0), shape.get(-1), shape.r[0]))
  ctx.point = trace(shape.get(0), shape.get(-1), shape.r[0])
  for (var i = 0; i < shape.length; i++) {
    // console.log(lineLength(ctx.point, shape.get(i)))
    ctx.arcTo(...shape.arcp(i))
    var lt = trace(ctx.point, shape.get(i + 1), -shape.r[0])
    // ctx.lineTo(...lt)
    ctx.point = lt
    // ctx.lineTo(...shape.get(i))
  }
  ctx.closePath()
  return ctx
}

function drawPoints(ctx, shape, size = 5) {
  ctx.beginPath && ctx.beginPath()
  for (var i = 0, arc = 2 * Math.PI, p; i < shape.length; i++) {
    p = shape.get(i)
    ctx.moveTo(...p)
    ctx.arc(...p, size, 0, arc)
  }
  return ctx
}

function trace(from, to, dist) {
  var xl = from[0] - to[0],
    yl = from[1] - to[1]
  var ll = Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2))
  dist = dist < 0 ? ll + dist : dist
  // console.log(ll, dist)
  var x = xl - (xl / ll) * dist + to[0]
  var y = yl - (yl / ll) * dist + to[1]
  return [x, y]
}

// function lineLength(from, to) {
//   var xl = from[0] - to[0],
//     yl = from[1] - to[1]
//   return Math.sqrt(Math.pow(xl, 2) + Math.pow(yl, 2))
// }

main()
