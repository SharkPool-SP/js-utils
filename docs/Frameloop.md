# FrameLoop

Run game loops within a frame-based system with configurable framerates and frame listeners.

## Defaults

**Default Framerate:** `60 FPS`

A framerate of `0` uses the user's screen refresh rate through `requestAnimationFrame()`.

> **Note:** `FrameLoop` uses `requestAnimationFrame()` when the framerate is set to `0`. In environments where `requestAnimationFrame()` is unavailable, it falls back to a `60 FPS` timer.

## Getting Started

```js
new FrameLoop(<number|undefined>)
```

Creates a new frame loop. It will use the provided framerate if provided, otherwise the _Default Framerate_.

```js
const loop = new FrameLoop();
```

## Methods

### start()

```js
loop.start();
```

Starts the frame loop.

If the loop is already running, calling `start()` has no effect.

---

### stop()

```js
loop.stop();
```

Stops the frame loop.

If the loop is already stopped, calling `stop()` has no effect.

---

### setFramerate()

```js
loop.setFramerate(<number>)
```

Sets the framerate of the frame loop to the specified value. Values are rounded.

A value of `0` uses the user's screen refresh rate through `requestAnimationFrame()`.

This method can be called before or during the loops execution.

```js
loop.setFramerate(30);
```

To use the display's animation frame rate:

```js
loop.setFramerate(0);
```

---

### onFrame()

```js
loop.onFrame(<Function>)
```

Adds a function that will execute on every frame.

Multiple listeners can be added to a loop.

```js
loop.onFrame(() => {
  console.log("Hello!");
});

loop.start();
```

---

### offFrame()

```js
loop.offFrame(<Function>)
```

Removes a registered listener from the frame loop.

```js
const update = () => {
  console.log("Update");
};

loop.onFrame(update);
loop.offFrame(update);
```
