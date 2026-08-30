# Patcher

A lightweight utility for monkeypatching functions and listening to object property access and modification at runtime.

## Methods

### patchBefore()

```js
Patcher.patchBefore(<Function>, <PatchFunction>)
```

Creates a patched function that executes a callback before the original function.

The patch callback receives `null` as its `returnValue` because the original function has not been executed yet. All arguments passed to the patched function are forwarded to the patch callback.

The patch callback can optionally return a value to modify the arguments passed to the original function:

- Returning `null` or `undefined` preserves the original arguments.
- Returning an array replaces the entire argument list.
- Returning any other value replaces the argument list with a single argument containing that value.

The returned function can be assigned in place of the original function.

```js
const original = function (value) {
  return value + 1;
};

const patched = Patcher.patchBefore(original, function (returnValue, value) {
  console.log("Add 1 to:", value);

  return value * 2;
});

console.log(patched(5));
// Add 1 to: 5
// 11
```

The patch above causes the original function to effectively be called as:

```js
original(10);
```

To replace multiple arguments, return an array:

```js
const original = function (a, b) {
  return a + b;
};

const patched = Patcher.patchBefore(original, function (returnValue, a, b) {
  return [a * 2, b * 2];
});

console.log(patched(2, 3));
// 10
```

The patch callback is invoked with the same `this` context as the original function.

---

### patchBeforeAsync()

```js
Patcher.patchBeforeAsync(<Function>, <PatchFunction>)
```

Creates an asynchronous patched function that waits for the patch callback to finish before executing the original function.

The patch callback receives `null` as its `returnValue` because the original function has not been executed yet. The callback can modify the arguments passed to the original function using the same rules as `patchBefore()`:

- Returning `null` or `undefined` preserves the original arguments.
- Returning an array replaces the entire argument list.
- Returning any other value replaces the argument list with a single argument containing that value.

This is useful when the patch needs to perform asynchronous work before allowing the original function to execute.

```js
const original = async function (value) {
  return value + 1;
};

const patched = Patcher.patchBeforeAsync(
  original,
  async function (returnValue, value) {
    await fetch(value);

    return value * 2;
  },
);

console.log(await patched(5));
// 11
```

The original function does not execute until the patch callback's promise has resolved.

The same `this` context is preserved when invoking both the patch callback and original function.

For example, an asynchronous patch can modify multiple arguments:

```js
const original = async function (a, b) {
  return a + b;
};

const patched = Patcher.patchBeforeAsync(
  original,
  async function (returnValue, a, b) {
    const multiplier = await getMultiplier();

    return [a * multiplier, b * multiplier];
  },
);

console.log(await patched(2, 3));
```

---

### patchAfter()

```js
Patcher.patchAfter(<Function>, <PatchFunction>)
```

Creates a patched function that executes the original function first, then invokes the patch callback.

The patch callback receives the original function's return value as its first argument, followed by the original arguments.

If the patch callback returns a non-null value, that value becomes the patched function's return value. Returning `null` or `undefined` preserves the original return value.

```js
const original = function (value) {
  return value + 1;
};

const patched = Patcher.patchAfter(original, function (returnValue, value) {
  console.log("Original returned:", returnValue);

  return returnValue + 1;
});

console.log(patched(5));
// Original returned: 6
// 7
```

If the patch callback does not provide a replacement value:

```js
const patched = Patcher.patchAfter(original, function (returnValue) {
  console.log(returnValue);
});

console.log(patched(5));
// 6
// 6
```

The patch callback is invoked with the same `this` context as the original function.

---

### patchAfterAsync()

```js
Patcher.patchAfterAsync(<Function>, <PatchFunction>)
```

Creates an asynchronous patched function that waits for the original function to finish before executing the patch callback.

The patch callback receives the resolved return value of the original function as its first argument, followed by the original arguments.

As with `patchAfter()`, returning a non-null value replaces the original return value. Returning `null` or `undefined` preserves it.

```js
const original = async function (value) {
  return value + 1;
};

const patched = Patcher.patchAfterAsync(
  original,
  async function (returnValue, value) {
    await saveAsync(returnValue);

    return returnValue + 1;
  },
);

console.log(await patched(5));
// 7
```

The patch callback does not execute until the original function's promise has resolved.

---

### getOriginal()

```js
Patcher.getOriginal(<Function>)
```

Retrieves the original function associated with a function created by one of the patch methods.

If the provided function is not a function created by `Patcher`, the method returns `null`.

```js
const original = function (value) {
  return value + 1;
};

const patched = Patcher.patchBefore(original, function () {});

const source = Patcher.getOriginal(patched);

console.log(source === original);
// true
```

This method only retrieves the original function. It does not automatically replace or restore the patched function on an object.

```js
object.method = Patcher.getOriginal(object.method);
```

---

### listenProperty()

```js
Patcher.listenProperty(<Object>, <String>, <PropertyCallbackObject>)
```

Attaches callbacks that are invoked when an object's property is accessed or modified.

The `callbacks` object can contain the following properties:

- `beforeGet` - Runs before the property's value is retrieved
- `get` - Alias for `beforeGet`
- `beforeSet` - Runs before a new value is assigned
- `afterSet` - Runs after a new value is assigned

The `beforeGet` and `get` callbacks receive the current property value.

The `beforeSet` and `afterSet` callbacks receive the new value being assigned.

Callbacks are invoked with the object containing the property as their `this` context.

```js
const user = {
  name: "Vicente G",
};

Patcher.listenProperty(user, "name", {
  beforeGet(value) {
    console.log("Reading:", value);
  },

  beforeSet(value) {
    console.log("Changing to:", value);
  },

  afterSet(value) {
    console.log("Changed to:", value);
  },
});

console.log(user.name);
// Reading: Vicente G

user.name = "John";
// Changing to: John
// Changed to: John
```

---

## PatchFunction

A `PatchFunction` is the callback used by the function patching methods.

```js
/**
 * @typedef {Function} PatchFunction
 *
 * @this {*} Original function context (`this`)
 * @param {*} returnValue Return value of the original function.
 *                        `null` when invoked before the original function.
 * @param {...*} args Arguments passed to the original function
 * @returns {*} For before-patches, any returned value replaces the arguments to the original function. An array
 *              replaces all arguments, while any other non-null value becomes the only argument.
 *              For after-patches, any returned value replaces the return value. Returning `null` or `undefined`
 *              preserves the original behavior.
 */
```

For example:

```js
Patcher.patchBefore(myFunction, function (returnValue, firstArg, secondArg) {
  // returnValue === null
  // firstArg === original first argument
  // secondArg === original second argument
});

Patcher.patchAfter(myFunction, function (returnValue, firstArg, secondArg) {
  // returnValue === result from myFunction
  // firstArg === original first argument
  // secondArg === original second argument
});
```

For `patchAfter()` and `patchAfterAsync()`, returning `null` or `undefined` causes the original function's return value to be preserved.

---

## PropertyCallbackObject

A `PropertyCallbackObject` defines the callbacks used by `listenProperty()`.

```js
/**
 * @typedef {Object} PropertyCallbackObject
 * @property {Function} beforeGet Callback that runs before accessing a property
 * @property {Function} get Alias to 'beforeGet'
 * @property {Function} beforeSet Callback that runs before setting a property
 * @property {Function} afterSet Callback that runs after setting a property
 */
```

Each callback is optional.

```js
Patcher.listenProperty(object, "value", {
  beforeGet(value) {
    console.log("Getting:", value);
  },

  beforeSet(value) {
    console.log("Setting:", value);
  },

  afterSet(value) {
    console.log("Set:", value);
  },
});
```
