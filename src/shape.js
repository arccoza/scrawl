import {vec2, mat2d} from 'gl-matrix'
import {Point, Matrix} from './geom.js'

export class Shape2 {
  constructor(p, r = [0]) {
    this.rad = r
    this.pts = []
    for (var i = 0, v; i < p.length; i+=2) {
      v = vec2.fromValues(p[i], p[i+1])
      this.pts.push(v)
    }
    // this.tfm = mat2d.fromValues(1, 0, -1, 1, 250, 0)
    this.tfm = mat2d.fromValues(1, 0, 0, 1, 0, 0)
  }

  get(idx) {
    return this.tfm ? vec2.transformMat2d(vec2.create(), this.pts[idx], this.tfm) : this.pts[idx]
  }

  draw(ctx) {
    ctx.beginPath && ctx.beginPath()
    
    // console.log(this.get(0))
    ctx.moveTo(...this.get(0))
    for (var i = 0, p; i < this.pts.length; i++) {
      // p = this.tfm ? vec2.transformMat2d(vec2.create(), this.pts[i], this.tfm) : this.pts[i]
      ctx.lineTo(...this.get(i))
    }
    
    ctx.closePath()
    return ctx
  }
}

export class Shape3 {
  constructor(p, r = [0]) {
    this.rad = r
    this.pts = []
    for (var i = 0, v; i < p.length; i+=2) {
      v = new Point(p[i], p[i+1])
      this.pts.push(v)
    }
    // this.tfm = new Matrix([1, 0, -1, 1, 250, 0])
    this.tfm = new Matrix([1, 0, 0, 1, 0, 0])
  }

  get(idx) {
    return this.tfm ? this.pts[idx].matrixTransform(this.tfm) : this.pts[idx]
  }

  draw(ctx) {
    ctx.beginPath && ctx.beginPath()
    
    var p = this.get(0)
    // console.log(p)
    ctx.moveTo(p.x, p.y)
    for (var i = 0, p; i < this.pts.length; i++) {
      p = this.get(i)
      ctx.lineTo(p.x, p.y)
    }
    
    ctx.closePath()
    return ctx
  }
}
