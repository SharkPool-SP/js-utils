# Rigidbody

A 2D math-based physics body class for handling shape collisions, transformations, spatial distance calculations, point touching, and more.

## Static Properties

**Body Type Constants: (`BodyType`)**

- `Rigidbody.BODY_SQUARE`: A square shape
- `Rigidbody.BODY_CIRCLE`: An approximate circular polygon using `CIRCLE_ACCURACY` vertices
- `Rigidbody.BODY_TRIANGLE`: A left-facing right triangle
- `Rigidbody.BODY_POLYGON`: A regular polygon with a customizable side count

**Utility Constants:**

- `Rigidbody.DEFAULT_POLY_SIDES`: (`6`) Default vertex count for polygon bodies
- `Rigidbody.MIN_POLY_SIDES`: (`3`) Minimum number of sides for a polygon body (isosceles triangle)
- `Rigidbody.CIRCLE_ACCURACY`: (`20`) Vertex count used to represent circle bodies
- `Rigidbody.TO_RADIAN`: Multiplier for converting degrees to radians

## Constructor

```js
new Rigidbody(<BodyType>, [number]);
```

Initializes a new `Rigidbody` instance with a shape type and optional vertex side count.

The first parameter is required. You must use a valid BodyType constant (`Rigidbody.BODY_*`). If the body type is invalid, it will throw an error.

If the optional number of sides is provided, it will be rounded and clamped to `Rigidbody.MIN_POLY_SIDES`. Otherwise it will default to `Rigidbody.DEFAULT_POLY_SIDES`.

```js
const box = new Rigidbody(Rigidbody.BODY_SQUARE);
const hexagon = new Rigidbody(Rigidbody.BODY_POLYGON, 6); // create a 6-sided polygon
```

---

## Body Properties

### x / y

```js
body.x = <number>;
body.y = <number>;
```

Gets or sets the body's horizontal (`x`) and vertical (`y`) position in world space. Setting these will automatically recalculate the body's vertices and edge axes.

---

### direction

```js
body.direction = <number>;
```

Gets or sets the rotation angle in degrees. Setting this will automatically recalculate the body's vertices and edge axes.

---

### scale

```js
body.scale = [<number>, <number>];
```

Gets or sets the `[widthScale, heightScale]` factors. Throws an error if the value is not a two-element array.

```js
box.scale = [2, 1.5]; // Scale width by 2x, height by 1.5x
```

Setting this will automatically recalculate the body's vertices and edge axes.

## Methods

### instance.setPolygonSides()

```js
body.setPolygonSides(<number>);
```

Updates the number of sides for a `BODY_POLYGON` type and recalculates its geometric representation. Has no effect on other shape types.

---

### instance.distanceToXY()

```js
body.distanceToXY(<number>, <number>);
```

Calculates the Euclidean distance from the body's center coordinates to a target `(x, y)` point.

---

### instance.getBounds()

```js
body.getBounds();
```

Returns the Axis-Aligned Bounding Box (AABB) of the body. This includes its scale and rotation.

```js
const bounds = box.getBounds();
// { width, height, left, right, top, bottom }
```

---

### instance.isTouchingXY()

```js
body.isTouchingXY(<number>, <number>);
```

Determines whether a target world coordinate `(x, y)` resides inside the body. Checks AABB bounds first before applying precise geometric point testing.

```js
if (box.isTouchingXY(100, -50)) {
  console.log("Point hits box!");
}
```

---

### instance.isTouchingBody()

```js
body.isTouchingBody(<Rigidbody>);
```

Performs a collision check with another `Rigidbody` instance using the Separating Axis Theorem (SAT). It performs an initial AABB check before projecting vertices across edge normals.

```js
if (box.isTouchingBody(hexagon)) {
  console.log("Shapes are colliding!");
}
```

## Static Methods

### transformPoint()

```js
Rigidbody.transformPoint(<number>, <number>, <number>, <number>, <number>, <number>);
```

Rotates a point `(x, y)` around a center pivot `(centerX, centerY)` given precalculated `cosAngle` and `sinAngle` values.
