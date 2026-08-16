# Color

Convert, transform, blend, and compare colors using several common color formats.

## Defaults

**Default Color:** `#000000`

**Supported Color Formats:**

- `Color.TYPE_HEX` -- Hexadecimal colors
- `Color.TYPE_RGBA` -- RGBA (`Object<red (r), green (g), blue (b), alpha (a)>`)
- `Color.TYPE_VECTOR` -- Color vectors (`Array<red (r), green (g), blue (b), alpha (a)>`)
- `Color.TYPE_HSVA` -- HSVA (`Object<hue (h), saturation (s), value (v), alpha (a)>`)

**Supported Blend Modes:**

- `Color.BLEND_ADD`
- `Color.BLEND_SUBTRACT`
- `Color.BLEND_MULTIPLY`

### Color Formats

**HEX**

A hexadecimal color string.

```text
#RRGGBB
#RRGGBBAA
```

**RGBA**

An object containing red, green, blue, and alpha channels.

```js
{
  r: 255,
  g: 255,
  b: 255,
  a: 1
}
```

Red, green, and blue values range from `0-255`. Alpha ranges from `0-1`.

**Vector**

An array containing normalized red, green, blue, and alpha channels.

```js
[1, 1, 1, 1];
```

All channels range from `0-1`.

**HSVA**

An object containing hue, saturation, value, and alpha channels.

```js
{
  h: 0,
  s: 0,
  v: 1,
  a: 1
}
```

Hue ranges from `0-359`. Saturation, value, and alpha range from `0-1`.

## Methods

### hexToType()

```js
Color.hexToType(<string>, <number>)
```

Converts a hexadecimal color to the specified color type.

The second argument should be one of the supported `Color.TYPE_*` constants.

```js
const rgba = Color.hexToType("#ff0000", Color.TYPE_RGBA);

console.log(rgba);
// { r: 255, g: 0, b: 0, a: 1 }
```

If no hexadecimal value is provided, the default black color is used.

---

### rgbaToType()

```js
Color.rgbaToType(<RGBAObject>, <number>)
```

Converts an RGBA color object to the specified color type.

The second argument should be one of the supported `Color.TYPE_*` constants.

```js
const hex = Color.rgbaToType({ r: 255, g: 0, b: 0, a: 1 }, Color.TYPE_HEX);

console.log(hex);
// "#ff0000ff"
```

If the alpha channel is not provided, it will be added for you; defaulting to `1`.

---

### vectorToType()

```js
Color.vectorToType(<ColorVector>, <number>)
```

Converts a color vector to the specified color type.

The second argument should be one of the supported `Color.TYPE_*` constants.

```js
const rgba = Color.vectorToType([1, 0, 0, 1], Color.TYPE_RGBA);

console.log(rgba);
// { r: 255, g: 0, b: 0, a: 1 }
```

If the alpha channel is not provided, it will be added for you; defaulting to `1`.

---

### hsvaToType()

```js
Color.hsvaToType(<HSVAObject>, <number>)
```

Converts an HSVA color to the specified color type.

The second argument should be one of the supported `Color.TYPE_*` constants.

```js
const hex = Color.hsvaToType({ h: 0, s: 1, v: 1, a: 1 }, Color.TYPE_HEX);

console.log(hex);
// "#ff0000ff"
```

If the alpha channel is not provided, it will be added for you; defaulting to `1`.

---

### mixVectors()

```js
Color.mixVectors(<ColorVector>, <ColorVector>, <number>)
```

Mixes two color vectors together using linear interpolation.

The third argument determines how much of the second color should be mixed into the first. Values are constrained to `0-1`.

```js
const red = [1, 0, 0, 1];
const blue = [0, 0, 1, 1];
const purple = Color.mixVectors(red, blue, 0.5);

console.log(purple);
// [0.5, 0, 0.5, 1]
```

A value of `0` returns the first color vector, whereas a value of `1` returns the second vector.

---

### blendVectors()

```js
Color.blendVectors(<ColorVector>, <ColorVector>, <number>)
```

Blends two color vectors using a specified blend mode.

```js
const result = Color.blendVectors([1, 0, 0, 1], [0, 1, 0, 1], Color.BLEND_ADD);
```

Available blend modes:

- `Color.BLEND_ADD`
- `Color.BLEND_SUBTRACT`
- `Color.BLEND_MULTIPLY`

**Add**

Adds the corresponding channels together and caps the result at `1`.

**Subtract**

Subtracts the second color's channels from the first and prevents the result from going below `0`.

**Multiply**

Multiplies the corresponding channels together.

---

### invertVector()

```js
Color.invertVector(<ColorVector>)
```

Inverts the RGB channels of a color vector.

```js
const inverted = Color.invertVector([1, 0, 0, 1]);

console.log(inverted);
// [0, 1, 1, 1]
```

The alpha channel is preserved.

---

### vectorMatches()

```js
Color.vectorMatches(<ColorVector>, <ColorVector>, <number>)
```

Checks whether two color vectors match (or are similar) using a specified softness value.

A softness of `0` requires the color channels to match exactly. Increasing the softness allows increasingly different colors to be considered a match.

```js
const red = [1, 0, 0, 1];
const almostRed = [0.95, 0.02, 0.01, 1];

const matches = Color.vectorMatches(red, almostRed, 0.1);

console.log(matches);
// true
```

The softness value is applied to all four channels, including alpha.
