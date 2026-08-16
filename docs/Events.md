# Events

Dispatch and handle custom events. This is similar to Nodes `event-emitter` import but with several other features. This utility supports listeners, one-time listeners, listener limiting, requests, asynchronous requests, and event cleanup.

## Methods

### emit()

```js
Events.emit(<string>, ...<any>)
```

Dispatches an event to all registered listeners.

Any additional arguments are passed to each listener in the same order they were provided.

```js
Events.on("update", (value) => {
  console.log(value);
});

Events.emit("update", 42);
// 42
```

If the event does not exist, nothing happens.

---

### request()

```js
Events.request(<string>, ...<any>)
```

Dispatches an event to all registered listeners and returns an array containing each listener's return value.

```js
Events.on("calculate", (value) => value * 2);
Events.on("calculate", (value) => value + 10);

const results = Events.request("calculate", 5);

console.log(results);
// [10, 15]
```

If the event does not exist, `undefined` is returned.

---

### requestAsync()

```js
Events.requestAsync(<string>, ...<any>)
```

Asynchronously runs all listeners and waits for every returned value to resolve.

Returns a `Promise` containing an array of listener results.

```js
Events.on("load", async (value) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value * 2), 1000);
  });
});

Events.on("load", async (value) => {
  return value + 10;
});

const results = await Events.requestAsync("load", 5);

console.log(results);
// [10, 15]
```

> **Note:** `requestAsync()` uses `Promise.all()`, so the returned promise rejects if one of the listener promises rejects.

---

### on()

```js
Events.on(<string>, <Function>)
```

Adds a listener to a custom event.

The listener is called whenever the event is emitted. Events run in a FIFO chain.

```js
Events.on("message", (message) => {
  console.log(message);
});

Events.emit("message", "Hello!");
```

---

### before()

```js
Events.before(<string>, <Function>)
```

Adds a listener to the beginning of an event's listener list.

The listener will run _before_ previously registered listeners.

```js
Events.on("update", () => console.log("Second"));

Events.before("update", () => console.log("First"));

Events.emit("update");

// First
// Second
```

---

### once()

```js
Events.once(<string>, <Function>)
```

Adds a listener that automatically removes itself after being called once.
The listener will only execute for the initial dispatch.

```js
Events.once("ready", () => {
  console.log("Ready!");
});

Events.emit("ready");
Events.emit("ready");

// Ready!
```

---

### off()

```js
Events.off(<string>, <Function>)
```

Removes a specific listener from an event.

```js
const listener = (value) => {
  console.log(value);
};

Events.on("update", listener);

Events.off("update", listener);
```

If a function is not provided, **all** listeners for the event are removed.

```js
Events.off("update");
```

---

### flush()

```js
Events.flush();
```

Removes all listeners and custom events.

---

### setMaxListeners()

```js
Events.setMaxListeners(<string>, <number|null>)
```

Sets the maximum number of listeners that an event can have.
By default, events have no limit.

Once the max is reached, you cannot add any new listeners.

Passing a number will set the limit:

```js
Events.setMaxListeners("update", 3);
```

Passing `null` will remove the limit:

```js
Events.setMaxListeners("update", null);
```

---

### getMaxListeners()

```js
Events.getMaxListeners(<string>)
```

Returns the max number of listeners allowed for a specified event.

```js
Events.setMaxListeners("update", 5);

console.log(Events.getMaxListeners("update"));
// 5
```

If the event has no limit, it returns `Infinity`.

If the event does not exist, it returns `null`.
