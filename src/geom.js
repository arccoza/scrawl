class DOMPoint {
  constructor(x = 0, y = 0, z = 0, w = 1) {
    this.x = x;
    this.y = y;
    this.z = z;
    this.w = w;
  }

  static fromPoint(src) {
    return new DOMPoint(
      src.x,
      src.y,
      src.z !== undefined ? src.z : 0,
      src.w !== undefined ? src.w : 1
    );
  }

  matrixTransform(matrix) {
    if (
      (matrix.is2D || matrix instanceof SVGMatrix) &&
      this.z === 0 &&
      this.w === 1
    ) {
      return new DOMPoint(
        this.x * matrix.a + this.y * matrix.c + matrix.e,
        this.x * matrix.b + this.y * matrix.d + matrix.f,
        0, 1
      );
    }
    else {
      return new DOMPoint(
        this.x * matrix.m11 + this.y * matrix.m21 + this.z * matrix.m31 + this.w * matrix.m41,
        this.x * matrix.m12 + this.y * matrix.m22 + this.z * matrix.m32 + this.w * matrix.m42,
        this.x * matrix.m13 + this.y * matrix.m23 + this.z * matrix.m33 + this.w * matrix.m43,
        this.x * matrix.m14 + this.y * matrix.m24 + this.z * matrix.m34 + this.w * matrix.m44
      );
    }
  }

  dot(src, origin=ORIGIN) {
    const x = (this.x - origin.x) * (src.x - origin.x),
    y = (this.y - origin.y) * (src.y - origin.y),
    z = (this.z - origin.z) * (src.z - origin.z)
    return x + y + z
  }

  magnitude(origin=ORIGIN) {
    const x = this.x - origin.x, y = this.y - origin.y, z = this.z - origin.z
    return Math.sqrt(x*x + y*y + z*z)
  }

  magnitudeSq(origin=ORIGIN) {
    const x = this.x - origin.x, y = this.y - origin.y, z = this.z - origin.z
    return x*x + y*y + z*z
  }

  angle(src, origin=ORIGIN) {
    const mag = this.magnitude(origin) * src.magnitude(origin),
    cos = mag && (this.dot(src, origin) / mag)
    return Math.acos(Math.min(Math.max(cos, -1), 1))
  }

  // (Math.cos(Math.PI*1) - 1)/2
  trace(src, origin=ORIGIN) {
    const mag1 = this.magnitude(origin),
    mag2 = src.magnitude(origin),
    mag = mag1 * mag2,
    cos = mag && (this.dot(src, origin) / mag)
    // return (cos + 1)
    return cos
  }

  travel(dist, origin=ORIGIN) {
    const to = this,
    xl = origin.x - to.x,
    yl = origin.y - to.y,
    ll = Math.sqrt(xl*xl + yl*yl)
    //dist = dist < 0 ? ll + dist : dist
    // dist = dist % ll
    // console.log(ll, dist)
    var x = xl - (xl / ll) * dist + to.x
    var y = yl - (yl / ll) * dist + to.y
    return new Point(x, y)
  }
}

const ORIGIN = new DOMPoint(),
DEGREES = 180/Math.PI,
Matrix = window.DOMMatrix || window.WebKitCSSMatrix,
Point = DOMPoint

export {Point, Matrix, DEGREES}
