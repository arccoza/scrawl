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

  dot(b, origin=ORIGIN) {
    const x = (this.x - origin.x) * (b.x - origin.x),
    y = (this.y - origin.y) * (b.y - origin.y),
    z = (this.z - origin.z) * (b.z - origin.z)
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

  angle(b, origin=ORIGIN) {
    const mag = this.magnitude(origin) * b.magnitude(origin),
    cos = mag && (this.dot(b, origin) / mag)
    return Math.acos(Math.min(Math.max(cos, -1), 1))
  }

  cosOf(b, origin=ORIGIN) {
    const mag = this.magnitude(origin) * b.magnitude(origin),
    cos = mag && (this.dot(b, origin) / mag)
    return cos
  }

  sinOf(b, origin=ORIGIN) {
    const cos = this.cosOf(b, origin)
    return Math.sqrt(1 - cos*cos)
  }

  tanOf(b, origin=ORIGIN) {
    const cos = this.cosOf(b, origin)
    return Math.sqrt(1 - cos*cos)/cos 
  }

  round(bf, af, rd=0, sm=0) {
    const cos = bf.cosOf(af, this), sin = bf.sinOf(af, this),
    r = rd * Math.sqrt((1 + cos) / (1 - cos)), r2 = r - (sin * r * KAPPA),
    a1 = bf.travel(r, this), a2 = af.travel(r, this),
    c1 = bf.travel(r2, this), c2 = af.travel(r2, this)
    return [a1, c1, c2, a2]
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
EPSILON = 1e-7,
KAPPA = 4 * (Math.sqrt(2) - 1) / 3,
Matrix = window.DOMMatrix || window.WebKitCSSMatrix,
Point = DOMPoint

export {Point, Matrix, DEGREES, EPSILON, KAPPA}
