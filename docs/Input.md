# Input

Utilities for detecting and handling keyboard and mouse input in browser-based apps.

> `Input` registers its keyboard and mouse event handlers when the class is initialized. This is a **static** class, you do not use `new Input()`.

## Keyboard

> **Note:** Methods that require a keyboard "key" argument in this utility use normalized key values. i.e., `Shift` → `shift`, `Digit0` → `0`, `ArrowLeft` → `left arrow`, '` `' → `space`, etc.

### isKeyDown()

```js
Input.isKeyDown(<string>, <boolean|undefined>)
```

Checks whether a specified keyboard key is currently pressed.

By default this uses a **strict** check. For example, if `a` is passed, it will only check if `a` is pressed, `A` (`shift` + `a`) will not count.

```js
if (Input.isKeyDown("a")) {
  movePlayer();
}
```

The second argument is optional. When enabled, it disables the strict check. Meaning, the difference between uppercase and lowercase key presses will be ignored.

```js
// Both will return true if 'A' or 'a' is pressed
Input.isKeyDown("a", true);
Input.isKeyDown("A", true);
```

---

### getKeysDown()

```js
Input.getKeysDown();
```

Returns an array containing the names of all keys currently being held down.

```js
const keys = Input.getKeysDown();

console.log(keys);
// ["W", "Shift"]
```

---

### addKeyHandler()

```js
Input.addKeyHandler(<Function>)
```

Adds a custom listener for keyboard events.

The listener receives the original `KeyboardEvent` followed by the event type.

```js
Input.addKeyHandler((event, type) => {
  console.log(type, event.key);
});
```

The event type will be either:

```text
keydown
keyup
```

---

### removeKeyHandler()

```js
Input.removeKeyHandler(<Function>)
```

Removes a keyboard listener previously added with `addKeyHandler()`.

```js
const handler = (event, type) => {
  console.log(type, event.key);
};

Input.addKeyHandler(handler);
Input.removeKeyHandler(handler);
```

## Mouse

### isMouseDown()

```js
Input.isMouseDown();
```

Returns whether the mouse is currently pressed.

```js
if (Input.isMouseDown()) {
  console.log("Mouse is down");
}
```

---

### isMouseClicked()

```js
Input.isMouseClicked(<number|undefined>)
```

Checks whether the mouse has been clicked. Unlike `isMouseDown` which returns true for however long the mouse is held down, `isMouseClicked` returns true _once_ when the mouse is initially clicked.

The optional argument specifies the time range (_in milliseconds_) that determines whether the mouse press can be considered a 'mouse click'.

The default range is `50ms`.

```js
if (Input.isMouseClicked()) {
  console.log("Mouse clicked!");
}
```

---

### getLastMouseButtonPressed()

```js
Input.getLastMouseButtonPressed();
```

Returns the button identifier of the most recently pressed mouse button.

The value corresponds to the browser's `MouseEvent.button` value.

Button 0 means the left mouse button, button 1 typically means the middle mouse button, and so on.

```js
const button = Input.getLastMouseButtonPressed();

console.log(button);
```

---

### getMousePosition()

```js
Input.getMousePosition(<boolean|undefined>)
```

Returns the current mouse position as an `[x, y]` array.

By default, the position is relative to the browser viewport.

```js
const [x, y] = Input.getMousePosition();

console.log(x, y);
```

Pass `true` to make the position relative to the center of the viewport:

```js
const [x, y] = Input.getMousePosition(true);
```

With center-relative coordinates, the center of the screen is:

```js
[0, 0];
```

Positions to the right and above the center produce positive values, whereas positions to the left and below produce negative values.

---

### addMouseHandler()

```js
Input.addMouseHandler(<Function>)
```

Adds a custom listener for mouse events.

The listener receives the original `MouseEvent` followed by the event type.

```js
Input.addMouseHandler((event, type) => {
  console.log(type, event.clientX, event.clientY);
});
```

The event type will be one of:

```text
mousedown
mouseup
mousemove
```

---

### removeMouseHandler()

```js
Input.removeMouseHandler(<Function>)
```

Removes a specified mouse listener added with `addMouseHandler()`.

```js
const handler = (event, type) => {
  console.log(type);
};

Input.addMouseHandler(handler);
Input.removeMouseHandler(handler);
```
