# Tween

Utilities for interpolating numbers using several different Tween animations.

You can check out the difference between tween animations **[here](https://easings.net/)**.

## Easing Types (`EaseType`)

The tween easing methods will always require the use of one of the following ease types:

```js
Tween.EASE_IN;
Tween.EASE_OUT;
Tween.EASE_IN_OUT;
```

`EASE_IN` starts slowly and accelerates toward the end.

`EASE_OUT` starts quickly and decelerates toward the end.

`EASE_IN_OUT` combines both behaviors, accelerating at the beginning and decelerating at the end.

## Methods

### clamp()

```js
Tween.clamp(<number>, <number>, <number>)
```

Constrains a number between a minimum and maximum value.

The arguments are as follows: `min`, `max`, `value`.

```js
const value = Tween.clamp(0, 100, 150);

console.log(value);
// 100
```

---

> **[!]** All methods past this point are different tween animations.
> The last parameter for each can be reffered to as `alpha`. This parameter determines the progression through the animation,
> where `0` represents the starting value and `1` represents the ending value.

### lerp()

```js
Tween.lerp(<number>, <number>, <number>)
```

Linearly interpolates between two numbers.

The third argument determines the position between the starting and ending values and is typically in the range `0-1`.

```js
const value = Tween.lerp(0, 100, 0.5);

console.log(value);
// 50
```

---

### sine()

```js
Tween.sine(<EaseType>, <number>, <number>, <number>)
```

Uses a sinusoidal easing curve to transition between two numbers.

This produces smooth acceleration and deceleration.

```js
const value = Tween.sine(Tween.EASE_IN_OUT, 0, 100, 0.5);
```

---

### quad()

```js
Tween.quad(<EaseType>, <number>, <number>, <number>)
```

Uses a quadratic easing curve.

The curve produces a parabolic acceleration or deceleration.

```js
const value = Tween.quad(Tween.EASE_IN, 0, 100, 0.5);
```

---

### cubic()

```js
Tween.cubic(<EaseType>, <number>, <number>, <number>)
```

Uses a cubic easing curve for a stronger acceleration or deceleration than quadratic easing.

```js
const value = Tween.cubic(Tween.EASE_OUT, 0, 100, 0.5);
```

---

### quart()

```js
Tween.quart(<EaseType>, <number>, <number>, <number>)
```

Uses a quartic easing curve.

The higher power creates a steeper acceleration curve.

```js
const value = Tween.quart(Tween.EASE_IN_OUT, 0, 100, 0.5);
```

---

### quint()

```js
Tween.quint(<EaseType>, <number>, <number>, <number>)
```

Uses a quintic easing curve.

This produces an extremely sharp acceleration or deceleration curve.

```js
const value = Tween.quint(Tween.EASE_IN, 0, 100, 0.5);
```

---

### expo()

```js
Tween.expo(<EaseType>, <number>, <number>, <number>)
```

Uses exponential easing.

This creates fast acceleration or deceleration near the edges of the transition.

```js
const value = Tween.expo(Tween.EASE_OUT, 0, 100, 0.5);
```

The method explicitly returns the starting value when `alpha` is `0` and the ending value when `alpha` is `1`.

---

### circ()

```js
Tween.circ(<EaseType>, <number>, <number>, <number>)
```

Uses circular easing.

Circular easing follows a curved transition and produces softer motion than exponential easing.

```js
const value = Tween.circ(Tween.EASE_IN_OUT, 0, 100, 0.5);
```

---

### back()

```js
Tween.back(<EaseType>, <number>, <number>, <number>)
```

Uses a back easing curve that overshoots slightly before settling toward the target value.

This can create a "pull back and release" effect.

```js
const value = Tween.back(Tween.EASE_OUT, 0, 100, 0.8);
```

---

### elastic()

```js
Tween.elastic(<EaseType>, <number>, <number>, <number>)
```

Uses an elastic easing curve that simulates a spring-like movement with multiple overshoots.

```js
const value = Tween.elastic(Tween.EASE_OUT, 0, 100, 0.8);
```

---

### bounce()

```js
Tween.bounce(<EaseType>, <number>, <number>, <number>)
```

Uses a bouncing easing curve.

The transition simulates an object bouncing against a surface, with every bounce getting smaller and smaller before reaching the final value.

```js
const value = Tween.bounce(Tween.EASE_OUT, 0, 100, 0.8);
```

## Tween Object

The `Tween` constructor can be used to create an object that tracks the progress of a tween over time.

### Constructor

```js
new Tween(
  <Function>,
  <EaseType>,
  <number>,
  <number>,
  <number>
)
```

The constructor accepts a tween function, easing type, starting value, ending value, and transition time in seconds.

```js
const tween = new Tween(
  Tween.sine, // use Sine easing animation
  Tween.EASE_IN_OUT, // ease-in-out mode
  0, // start at 0
  100, // end at 100
  2, // progress over 2 seconds
);
```

The transition time determines how long the tween takes to progress from its starting value to its ending value.

---

### instance.value

```js
tween.value;
```

Returns the current interpolated value of the tween.

Accessing `value` automatically calculates the tween's current progress based on elapsed time.

```js
const tween = new Tween(Tween.sine, Tween.EASE_IN_OUT, 0, 100, 2);

console.log(tween.value); // starts at 0
// ...wait 2 seconds
console.log(tween.value); // ends at 100
```

Repeatedly accessing `value` will produce progressively updated values as time passes.

```js
const tween = new Tween(Tween.quad, Tween.EASE_OUT, 0, 500, 1);

function update() {
  const value = tween.value;

  console.log(value);

  requestAnimationFrame(update);
}

update();
```

Once the transition time has elapsed, the tween's progress is clamped to `1` and the value reaches the ending value.
