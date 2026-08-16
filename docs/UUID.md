# UUID

Generate randomized strings for unique IDs, with configurable character sets and lengths.

## Defaults

**Default UUID Length:** `15`

**Default Soup:** `ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789`

> A _soup_ is the set of characters that the UUID generator can use when creating an ID.

## Methods

### setSoup()

```js
UUID.setSoup(<string>)
```

Sets the character set used when generating UUIDs.

This method expects a single string argument. If the argument is missing, empty, or not a string, the soup is reset to the default character set.

---

### getSoup()

```js
UUID.getSoup();
```

Returns the character set currently being used by the UUID generator.

---

### UUID.gen()

```js
UUID.gen(<number>)
```

Generates a random UUID string with a specified length.

The length is optional and defaults to the '_Default UUID Length_'. If a length is provided, it will be rounded and constrained to a minimum of `1`.

**Example:**

```js
const id = UUID.gen();
const lengthyId = UUID.gen(24);

console.log(id); // "aZ82kLm91PxQw7R"
console.log(lengthyId); // "x8Qm2ZaP7kL91wR3tY6BcD4"
```

---

### UUID.hash()

```js
UUID.hash(<string>)
```

Generates a compact hash from a string value using the **FNV-1a** hashing algorithm.

The passed argument will be converted to a string before hashing.

> [!] Though extremely, _extremely_ rare, hash collisions are possible with specific values.

```js
const hash = UUID.hash("Hello World");

console.log(hash);
// "-l7i9cp"
```

The same input will produce the same hash:

```js
UUID.hash("example") === UUID.hash("example");
// true
```
