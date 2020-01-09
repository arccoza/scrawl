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
    return Math.hypot(this.x - origin.x, this.y - origin.y, this.z - origin.z)
  }

  magnitudeSq(origin=ORIGIN) {
    var x = this.x - origin.x, y = this.y - origin.y, z = this.z - origin.z
    return x*x + y*y + z*z
  }

  angle(src, origin=ORIGIN, inDeg=false) {
    origin = origin || ORIGIN
    // We calculate the first magnitude, if it is 0 then we short circuit the second magnitude calc
    // and taking the 0 of mag1 for mag2 from mag1 &&.. because later we would mag1 * mag2 which would
    // give 0 anyway.
    const mag1 = this.magnitude(origin), mag2 = mag1 && src.magnitude(origin),
    // We don't calc the dot product or anything else if mag1 is 0 and short circuit thanks to mag1 &&..
    // and just get the 0 of mag1, because mag1 * mag2 would be 0.
    cos = mag1 && (this.dot(src, origin) / (mag1 * mag2))
    // Take the inverse cosine, arccos, to get our angle.
    return Math.acos(cos) * (inDeg ? DEGREE : 1)
  }
}

const ORIGIN = new DOMPoint(),
DEGREE = 180/Math.PI,
Matrix = window.DOMMatrix || window.WebKitCSSMatrix,
Point = DOMPoint

export {Point, Matrix}