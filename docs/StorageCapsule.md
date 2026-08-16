# StorageCapsule

Manage `localStorage` data using isolated namespaces, explicit data-type validation, and lightweight compression (assisted with the `LZ-String` library).

## Defaults

**Data Type Constants: (`StorageDataType`)**

- `StorageCapsule.TYPE_AUTO`: Automatically sets the datatype upon the first call to `store()`
- `StorageCapsule.TYPE_STRING`: Accepts standard string values
- `StorageCapsule.TYPE_NUMBER`: Accepts numeric values
- `StorageCapsule.TYPE_ARRAY`: Accepts JavaScript arrays
- `StorageCapsule.TYPE_OBJECT`: Accepts standard key-value objects

---

## Constructor

```js
new StorageCapsule(<string>);
```

Initializes a new `StorageCapsule` instance under a specific `localStorage` key (reffered to as a **namespace**).

The only parameter this constructor takes is the `namespace` (string) argument. This is the key that stores the compressed data saved in `localStorage`. If not provided, it will default to `LocalStorageCapsule`.

```js
const userSession = new StorageCapsule("UserSession");
```

## Methods

### instance.registerDataSpace()

```js
capsule.registerDataSpace(<string>, <StorageDataType>);
```

Creates a named slot (reffered to as **dataspace**) with an assigned data type constant.

This method requires a string name for the dataspace and a valid data type from StorageDataType list (`StorageCapsule.TYPE_*`).

> **[!]** If the name or data type is invalid, this method will throw an error.

```js
userSession.registerDataSpace("username", StorageCapsule.TYPE_STRING);
userSession.registerDataSpace("loginCount", StorageCapsule.TYPE_NUMBER);
userSession.registerDataSpace("preferences", StorageCapsule.TYPE_AUTO);
```

---

### instance.store()

```js
capsule.store(<string>, <any>);
```

Assigns data to a registered dataspace. This method will throw an error if the type of data does not match the registered configuration or if the slot does not exist.

```js
userSession.store("username", "Alex");
userSession.store("loginCount", 5);
```

---

### instance.get()

```js
capsule.get(<string>);

```

Retrieves the currently held value from a registered dataspace in memory.

```js
const username = userSession.get("username"); // "Alex"
```

---

### instance.getAll()

```js
capsule.getAll();
```

Returns an object containing key-value pairs of all registered dataspaces and their current memory values.

```js
const allData = userSession.getAll();
// { username: "Alex", loginCount: 5, preferences: undefined }
```

---

### instance.deleteDataSpace()

```js
capsule.deleteDataSpace(<string>);

```

Removes a registered dataspace from the instance memory.

---

### instance.hasDataSpace()

```js
capsule.hasDataSpace(<string>);

```

Returns `true` if a dataspace of the given name is registered, otherwise `false`.

---

### instance.pushData()

```js
capsule.pushData();
```

Compresses all active dataspaces from memory and saves the data directly to `localStorage` under the instance's `namespace`.

This essentially saves the data.

```js
userSession.pushData();
```

> [!] The compression applied by this utility causes precision loss on floating-point numbers passed six decimal places (rounding via `toFixed(5)`).

---

### instance.retrieveData()

```js
capsule.retrieveData();
```

Fetches the compressed data from `localStorage`, decompresses the dataspaces, and unloads them to the instance in memory.

This essentially loads the data.

> **[!]** If the stored data is corrupted or malformed, it will catch the error, issue a warning, and remove the corrupted key from `localStorage`.

```js
userSession.retrieveData();
```
