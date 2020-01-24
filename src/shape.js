import {Point, Matrix, DEGREES} from './geom.js'

export class Shape {
  constructor(p, r = [0]) {
    this.rad = r
    this.pts = []
    for (var i = 0, v; i < p.length; i+=2) {
      v = new Point(p[i], p[i+1])
      this.pts.push(v)
    }
    this.transform = new Matrix([1, 0, 0, 1, 0, 0])
    this.isClosed = true
  }

  get(idx) {
    idx = idx >= 0 ? idx : this.pts.length + idx
    const pt = this.pts[idx], tfm = this.transform
    return tfm.isIdentity || pt == null ? pt : pt.matrixTransform(tfm)
  }

  draw(ctx) {
    const pts = this.pts, isClosed = this.isClosed, wedge = new Array(3)
    
    // If the ctx is a Path2D it won't have beginPath, check before call
    ctx.beginPath && ctx.beginPath()

    // If the shape has fewer than 3 points no need for anything fancy
    if (pts.length < 3) {
      pts.forEach((p, i) => i == 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
      return isClosed && ctx.closePath(), ctx
    }
    
    
    var p = this.get(0)
    ctx.moveTo(p.x, p.y)
    for (var i = 0; i < this.pts.length; i++) {
      p = this.get(i)
      ctx.lineTo(p.x, p.y)
      // ctx.arcTo(p.x, p.y, p.x, p.y, 50)
    }
    
    return isClosed && ctx.closePath(), ctx
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
