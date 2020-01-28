import './styles.css'
import { Shape } from './shape.js'
import { Point, Matrix, DEGREES } from './geom.js'

function main () {
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')
  var shape0 = new Shape0([20, 0, 220, 0, 200, 200, 50, 200, 0, 250], [10])
  var shape = new Shape([0, 0, 200, 0, 200, 200, 50, 200, 0, 250], [10])
  shape.o = [10, 10]
  shape.isClosed = true
  var shapePath = new Path2D()
  var pointsPath = new Path2D()
  // var shapePath = draw(new Path2D(), shape)
  // shapePath.rect(0, 0, 50, 50)
  shape.transform.translateSelf(51, 51)
  // shape.transform.scaleSelf(3)
  // shape.transform.skewXSelf(45)
  shape.draw(shapePath)
  // shape.drawPoints(pointsPath)
  // ctx.setTransform(1, 0, -1, 1, 150, 0)
  // ctx.lineWidth = 1 * 3
  ctx.stroke(shapePath)
  ctx.fillStyle = 'rgba(255,0,0,0.5)'
  ctx.fill(pointsPath)

  // var r = 50
  // var a = new Point(200, 200), b = new Point(200, 0)
  // var ang = a.angle(b)
  // var cos = a.angleCos(b), sin = Math.sqrt(1 - cos*cos), dist2 = r * Math.sqrt((1 + cos) / (1 - cos))
  // var dist = 1/Math.tan(ang/2) * r, c = a.travel(dist2)
  // var f = (4/3)*Math.tan(ang/4), c1 = cos + f*sin, c2 = sin - f*cos
  // var d = b.travel(dist2), dist3 = dist2 - (sin * dist2*0.55)
  // //dist2 - Math.sin(ang)*dist2*0.55
  // //dist2 - (Math.tan(ang/2) * dist2)
  // console.log(ang, cos, sin, 1-((cos+1)/2))
  // //(Math.abs(cos))*0.45*dist2
  // //(dist2*0.45) + Math.pow((cos),2) * (dist2*0.45)
  // //dist2 - (dist2 * 0.55) * 1/Math.sqrt((1 + cos) / (1 - cos))
  // //dist2 - dist2*0.55*Math.pow((cos+1)/2, (cos+1)/2)
  // //dist3 = dist2 - dist2*0.55*Math.pow((1 - cos) / (1 + cos), 0.3*cos)
  // //(dist2 - r) - (cos+1)//dist2/2 + cos*(dist2 - r)/2.4 //* Math.sqrt((1 + cos) / (1 - cos)) //dist2*0.5//dist2/Math.sqrt(cos + 1)//(dist2 - r)
  // var e = a.travel(dist3), f = b.travel(dist3)
  // console.log(dist, dist2, dist3, (cos+1)/2, Math.sqrt((1 + cos) / (1 - cos)))
  // ctx.translate(150, 0)
  // ctx.beginPath()
  // ctx.strokeStyle = 'black'
  // ctx.moveTo(0, 0)
  // ctx.lineTo(a.x, a.y)
  // ctx.moveTo(0, 0)
  // ctx.lineTo(b.x, b.y)
  // ctx.moveTo(0, 0)
  // ctx.stroke()

  // console.log(d)
  // ctx.beginPath()
  // // ctx.lineTo(c.x, c.y)
  // ctx.moveTo(c.x, c.y)
  // ctx.arc(c.x, c.y, 5, 0, 2 * Math.PI)
  // ctx.stroke()

  // ctx.beginPath()
  // // ctx.lineTo(c.x, c.y)
  // ctx.moveTo(e.x, e.y)
  // ctx.arc(e.x, e.y, 5, 0, 2 * Math.PI)
  // ctx.stroke()

  // ctx.beginPath()
  // ctx.strokeStyle = 'red'
  // ctx.moveTo(c.x, c.y)
  // ctx.arcTo(0, 0, d.x, d.y, r)
  // ctx.stroke()

  // ctx.beginPath()
  // ctx.strokeStyle = 'blue'
  // ctx.moveTo(c.x, c.y)
  // ctx.bezierCurveTo(e.x, e.y, f.x, f.y, d.x, d.y)
  // ctx.stroke()

  // ctx.fillStyle = "rgba(255,0,0,0.5)"
  // ctx.fill(drawPoints(new Path2D(), shape, 10))
}

class Shape0 {
  constructor (p, r = [0]) {
    this.p = p
    this.r = r
    this.o = [0, 0]
  }

  get length () {
    return this.p.length / 2
  }

  get (i, withR = false) {
    i %= this.length
    var p = this.p.slice((i = i * 2), i + 2 || this.p.length)
    return [p[0] + this.o[0], p[1] + this.o[1]]
  }

  round (i) {
    return (this.r.length === 1 && this.r[0]) || this.r[i] || 0
  }

  arcp (i) {
    var r = this.round(i)
    var a = this.get(i)
    if (!r) return [...a, ...a, r]

    // var z = this.get(i - 1),
    var b = this.get(i + 1)
    return [...a, ...trace(a, b, r), r]
  }
}

function draw (ctx, shape) {
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

function drawPoints (ctx, shape, size = 5) {
  ctx.beginPath && ctx.beginPath()
  for (var i = 0, arc = 2 * Math.PI, p; i < shape.length; i++) {
    p = shape.get(i)
    ctx.moveTo(...p)
    ctx.arc(...p, size, 0, arc)
  }
  return ctx
}

function trace (from, to, dist) {
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
