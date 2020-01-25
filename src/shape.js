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
    this.isClosed = false
  }

  get(idx) {
    idx = idx >= 0 ? idx : this.pts.length + idx
    const pt = this.pts[idx], tfm = this.transform
    return tfm.isIdentity || pt == null ? pt : pt.matrixTransform(tfm)
  }

  edge(s, e) {
    const pts = this.pts, len = pts.length, tfm = this.transform
    s = (s < 0 ? len + s : s) % len
    e = (e < 0 ? len + e : e) % len
    const sl = e < s ? [...pts.slice(s), ...pts.slice(0, e)] : pts.slice(s, e)
    return !tfm.isIdentity ? sl.map(pt => pt.matrixTransform(tfm)) : sl
  }

  draw(ctx) {
    const pts = this.pts, len = pts.length, isClosed = this.isClosed
    
    // If the ctx is a Path2D it won't have beginPath, check before call
    ctx.beginPath && ctx.beginPath()

    // If the shape has fewer than 3 points no need for anything fancy
    if (pts.length < 3) {
      pts.forEach((p, i) => i == 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y))
      return isClosed && ctx.closePath(), ctx
    }
        
    for (var i = 0; i < len; i++) {
      var w = this.edge(i-1, i+2), r = this.rad[0]
      var [a1, c1, c2, a2] = w[1].round(w[0], w[2], r, 0.6)

      i ? ctx.lineTo(a1.x, a1.y) : ctx.moveTo(a1.x, a1.y)
      ctx.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, a2.x, a2.y)
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
