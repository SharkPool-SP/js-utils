/**
 * 2D math-based shape collision checking and utilties.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class Rigidbody {
  /** Body Types */
  static BODY_SQUARE = 0;
  static BODY_CIRCLE = 1;
  static BODY_TRIANGLE = 2; // for clarity this is a left-facing right triangle
  static BODY_POLYGON = 3;

  /** Constants */
  static DEFAULT_POLY_SIDES = 6; // hexagon
  static MIN_POLY_SIDES = 3; // isosceles triangle
  static CIRCLE_ACCURACY = 20;
  static TO_RADIAN = Math.PI / 180;

  /** Class Utilities */

  /**
   * Transforms a coordinate around a center coordinate.
   *
   * @param {number} x horizontal point position
   * @param {number} y vertical point position
   * @param {number} centerX horizontal center to transform around
   * @param {number} centerY vertical center to transform around
   * @param {number} cosAngle angle to transform around in cosine
   * @param {number} sinAngle angle to transform around in sine
   * @returns object containing transformed coordinates
   */
  static transformPoint(x, y, centerX, centerY, cosAngle, sinAngle) {
    const dx = x - centerX;
    const dy = y - centerY;
    return {
      x: dx * cosAngle + dy * sinAngle,
      y: -dx * sinAngle + dy * cosAngle,
    };
  }

  /**
   * Projects the range of a polygons' points on a specified axis.
   *
   * @private
   * @param {number[]} axis array of coordinate objects that specify the axis
   * @param {number[]} polyPoints array of point objects in a polygon
   * @returns object min and max points of a polygon on an axis
   */
  static projectPolygon(axis, polyPoints) {
    let min = Infinity;
    let max = -Infinity;
    for (let point of polyPoints) {
      let proj = point.x * axis.x + point.y * axis.y;
      if (proj < min) min = proj;
      if (proj > max) max = proj;
    }
    return { min, max };
  }

  /** Body Specific Utilities */
  /**
   * Constructs a Rigidbody object.
   *
   * @param {number} bodyType the rigidbody shape type (BODY_POLYGON, BODY_SQUARE, etc.)
   * @param {number} optPolySides (optional) number of sides on this polygon
   */
  constructor(bodyType, optPolySides) {
    if (
      typeof bodyType !== "number" ||
      bodyType < 0 ||
      bodyType > Rigidbody.BODY_POLYGON
    ) {
      throw new Error("Rigidbody body type is unknown");
    }

    this._type = bodyType;
    this._polyPoints = null;
    this._axesProjection = null;

    this._x = 0;
    this._y = 0;
    this._direction = 0;
    this._scale = [1, 1];

    if (this._type === Rigidbody.BODY_POLYGON) {
      this.polySides =
        optPolySides >= Rigidbody.MIN_POLY_SIDES
          ? Math.round(optPolySides)
          : Rigidbody.DEFAULT_POLY_SIDES;
    }

    this._updatePolyPoints();
  }

  /** Setters and Getters */
  get x() {
    return this._x;
  }
  set x(v) {
    if (this._x !== v) {
      this._x = v;
      this._updatePolyPoints();
    }
  }

  get y() {
    return this._y;
  }
  set y(v) {
    if (this._y !== v) {
      this._y = v;
      this._updatePolyPoints();
    }
  }

  get direction() {
    return this._direction;
  }
  set direction(v) {
    if (this._direction !== v) {
      this._direction = v;
      this._updatePolyPoints();
    }
  }

  get scale() {
    return this._scale;
  }
  set scale(v) {
    if (!Array.isArray(v) || v.length !== 2) {
      throw new Error("scale must be [x, y]");
    }

    if (this._scale[0] !== v[0] || this._scale[1] !== v[1]) {
      this._scale = v;
      this._updatePolyPoints();
    }
  }

  /**
   * Constructs this body's polygon points and projections.
   * Used when updating body attributes (x, y, direction, scale).
   *
   * @private
   */
  _updatePolyPoints() {
    this._polyPoints = [];
    this._axesProjection = [];

    const rad = this.direction * Rigidbody.TO_RADIAN;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);

    const scaledX = 50 * this.scale[0];
    const scaledY = 50 * this.scale[1];

    const addPoint = (px, py) => {
      const rx = this.x + (px * cos - py * sin);
      const ry = this.y * -1 + (px * sin + py * cos);
      this._polyPoints.push({ x: rx, y: ry });
    };

    // construct the rigidbody's shape points
    switch (this._type) {
      case Rigidbody.BODY_SQUARE:
        addPoint(-scaledX, -scaledY);
        addPoint(scaledX, -scaledY);
        addPoint(scaledX, scaledY);
        addPoint(-scaledX, scaledY);
        break;
      case Rigidbody.BODY_TRIANGLE:
        addPoint(scaledX, scaledY);
        addPoint(-scaledX, scaledY);
        addPoint(-scaledX, -scaledY);
        break;
      case Rigidbody.BODY_CIRCLE:
        for (let i = 0; i < this.CIRCLE_ACCURACY; i++) {
          const angle = i * (360 / this.CIRCLE_ACCURACY) * Rigidbody.TO_RADIAN;
          addPoint(Math.cos(angle) * scaledX, Math.sin(angle) * scaledY);
        }
        break;
      case Rigidbody.BODY_POLYGON:
        for (let i = 0; i < this.polySides; i++) {
          const angle = i * (360 / this.polySides) * Rigidbody.TO_RADIAN;
          addPoint(Math.cos(angle) * scaledX, Math.sin(angle) * scaledY);
        }
        break;
    }

    // construct the axes projections
    for (let i = 0; i < this._polyPoints.length; i++) {
      const p1 = this._polyPoints[i];
      const p2 = this._polyPoints[(i + 1) % this._polyPoints.length];

      const edgeNormal = {
        x: (p2.y - p1.y) * -1,
        y: p2.x - p1.x,
      };
      const mag = Math.sqrt(
        edgeNormal.x * edgeNormal.x + edgeNormal.y * edgeNormal.y,
      );

      this._axesProjection.push({
        x: edgeNormal.x / mag,
        y: edgeNormal.y / mag,
      });
    }
  }

  /**
   * Changes the number of sides of this POLYGON Rigidbody.
   *
   * @param {number} sides new number of sides of this polygon
   */
  setPolygonSides(sides) {
    if (this._type === Rigidbody.BODY_POLYGON) {
      this.polySides =
        sides >= Rigidbody.MIN_POLY_SIDES
          ? Math.round(sides)
          : Rigidbody.DEFAULT_POLY_SIDES;
      this._updatePolyPoints();
    }
  }

  /**
   * Computes the distance from this body to a given coordinate.
   *
   * @param {number} x horizontal position
   * @param {number} y vertical position
   * @returns the distance from this body to a coordinate
   */
  distanceToXY(x, y) {
    const dx = this.x - x;
    const dy = this.y - y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  /**
   * Computes this body's bounding box.
   *
   * @returns bounding box object
   */
  getBounds() {
    const width = 100 * this.scale[0];
    const height = 100 * this.scale[1];
    const rads = -this.direction * Rigidbody.TO_RADIAN;
    const rotWidth =
      Math.abs(width * Math.cos(rads)) + Math.abs(height * Math.sin(rads));
    const rotHeight =
      Math.abs(width * Math.sin(rads)) + Math.abs(height * Math.cos(rads));

    return {
      width: rotWidth,
      height: rotHeight,
      left: this.x - rotWidth / 2,
      right: this.x + rotWidth / 2,
      top: -this.y + rotHeight / 2,
      bottom: -this.y - rotHeight / 2,
    };
  }

  /**
   * Checks if this body is colliding with a given coordinate.
   *
   * @param {number} x horizontal point position
   * @param {number} y horizontal point position
   * @returns true if the given coordinate is within this body
   */
  isTouchingXY(x, y) {
    // first check if we're even inside this bodies bounding box
    const bounds = this.getBounds();
    if (
      x > bounds.right ||
      x < bounds.left ||
      y > bounds.top ||
      y < bounds.bottom
    ) {
      return false;
    }

    // now do hard point check
    const angle = this.direction * Rigidbody.TO_RADIAN;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    const halfWidth = 50 * this.scale[0];
    const halfHeight = 50 * this.scale[1];

    // transform point to fixate the body direction
    const localPoint = Rigidbody.transformPoint(
      x,
      y * -1,
      this.x,
      this.y * -1,
      cos,
      sin,
    );

    switch (this._type) {
      case Rigidbody.BODY_SQUARE: {
        return (
          localPoint.x >= -halfWidth &&
          localPoint.x <= halfWidth &&
          localPoint.y >= -halfHeight &&
          localPoint.y <= halfHeight
        );
      }
      case Rigidbody.BODY_CIRCLE: {
        if (this.scale[0] === this.scale[1]) {
          // non-stretched circle
          const dx = x - this.x;
          const dy = y - this.y * -1;
          return dx * dx + dy * dy <= halfWidth * halfWidth;
        } else {
          const dx = localPoint.x / halfWidth;
          const dy = localPoint.y / halfHeight;
          return dx * dx + dy * dy <= 1;
        }
      }
      case Rigidbody.BODY_POLYGON: {
        if (!this._polyPoints || !this._axesProjection) {
          this._updatePolyPoints();
        }

        let inside = false;
        for (
          let i = 0, j = this._polyPoints.length - 1;
          i < this._polyPoints.length;
          j = i++
        ) {
          // transform polygon points into local space
          const pi = Rigidbody.transformPoint(
            this._polyPoints[i].x,
            this._polyPoints[i].y,
            this.x,
            this.y * -1,
            cos,
            sin,
          );
          const pj = Rigidbody.transformPoint(
            this._polyPoints[j].x,
            this._polyPoints[j].y,
            this.x,
            this.y * -1,
            cos,
            sin,
          );

          const intersect =
            pi.y > localPoint.y !== pj.y > localPoint.y &&
            localPoint.x <
              ((pj.x - pi.x) * (localPoint.y - pi.y)) / (pj.y - pi.y) + pi.x;

          if (intersect) inside = !inside;
        }
        return inside;
      }
      case Rigidbody.BODY_TRIANGLE: {
        const p1 = [-halfWidth, -halfHeight]; // bottom-left
        const p2 = [halfWidth, halfHeight]; // bottom-right
        const p3 = [-halfWidth, halfHeight]; // top-left

        const wholeArea =
          Math.abs(
            p1[0] * (p2[1] - p3[1]) +
              p2[0] * (p3[1] - p1[1]) +
              p3[0] * (p1[1] - p2[1]),
          ) / 2;

        const area1 =
          Math.abs(
            localPoint.x * (p2[1] - p3[1]) +
              p2[0] * (p3[1] - localPoint.y) +
              p3[0] * (localPoint.y - p2[1]),
          ) / 2;
        const area2 =
          Math.abs(
            p1[0] * (localPoint.y - p3[1]) +
              localPoint.x * (p3[1] - p1[1]) +
              p3[0] * (p1[1] - localPoint.y),
          ) / 2;
        const area3 =
          Math.abs(
            p1[0] * (p2[1] - localPoint.y) +
              p2[0] * (localPoint.y - p1[1]) +
              localPoint.x * (p1[1] - p2[1]),
          ) / 2;
        return Math.abs(wholeArea - (area1 + area2 + area3)) < 0.001;
      }
    }

    return false;
  }

  /**
   * Checks if this body is colliding with another body.
   *
   * @param {Rigidbody} body other Rigidbody object to check collision with
   * @returns true if this body is intersecting with another body
   */
  isTouchingBody(body) {
    if (!body || !(body instanceof Rigidbody)) {
      throw new Error("Rigidbody object must be passed in collision check!");
    }

    // first check if we're even inside this bodies bounding box
    const bounds1 = this.getBounds();
    const bounds2 = body.getBounds();
    if (
      bounds1.right < bounds2.left ||
      bounds1.left > bounds2.right ||
      bounds1.bottom > bounds2.top ||
      bounds1.top < bounds2.bottom
    ) {
      return false;
    }

    // now do a hard collision check
    if (!this._polyPoints || !this._axesProjection) this._updatePolyPoints();
    if (!body._polyPoints || !body._axesProjection) body._updatePolyPoints();

    const axes = [...this._axesProjection, ...body._axesProjection];
    for (let axis of axes) {
      const proj1 = Rigidbody.projectPolygon(axis, this._polyPoints);
      const proj2 = Rigidbody.projectPolygon(axis, body._polyPoints);
      if (!(proj1.min <= proj2.max && proj2.min <= proj1.max)) return false;
    }
    return true;
  }
}

export { Rigidbody };
