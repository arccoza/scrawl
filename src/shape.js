import {Point, Matrix} from './geom.js'

export class Shape {
  constructor(p, r = [0]) {
    this.rad = r
    this.pts = []
    for (var i = 0, v; i < p.length; i+=2) {
      v = new Point(p[i], p[i+1])
      this.pts.push(v)
    }
    this.tfm = new Matrix([1, 0, 0, 1, 0, 0])
  }

  get(idx) {
    return !this.tfm.isIdentity ? this.pts[idx].matrixTransform(this.tfm) : this.pts[idx]
  }

  draw(ctx) {
    ctx.beginPath && ctx.beginPath()
    
    console.log(this.get(1).angle(this.get(2), new Point(200, 0), true))
    // console.log(this.get(3).magnitudeSq(this.get(2)))
    // console.log(this.get(1).dot(this.get(2), this.get(3)))
    var p = this.get(0)
    ctx.moveTo(p.x, p.y)
    for (var i = 0; i < this.pts.length; i++) {
      p = this.get(i)
      ctx.lineTo(p.x, p.y)
    }
    
    ctx.closePath()
    return ctx
  }

  drawPoints(ctx, size=5) {
    ctx.beginPath && ctx.beginPath()
    for (var i = 0, arc = 2 * Math.PI, p; i < this.pts.length; i++) {
      p = this.get(i)
      ctx.moveTo(p.x, p.y)
      ctx.arc(p.x, p.y, size, 0, arc)
    }
    return ctx
  }
}
