# ModuleLoader

A lightweight dynamic asset and ES module loader for loading HTML, CSS, and JavaScript at runtime.

## Methods

### importDependency()

```js
ModuleLoader.importDependency(<string>, <Element | undefined>)
```

Loads an HTML, CSS, or JavaScript dependency and applies it to the document.

- `HTML` dependencies fetch the HTML and appends it to a specified container, or `document.body` if no container is provided.
- `CSS` dependencies create a `<link>` element and appends it to document.head.
- `JavaScript` dependencies create a `<script type="module">` element and appends it to `document.body`.

The first url argument must be a URL pointing to an `.html`, `.css`, or `.js` file.

The optional `opt_container` argument specifies the element in which HTML content should be added to. If not provided, HTML content is appended to `document.body`.

```js
const targetElement = document.querySelector(".container");

await ModuleLoader.importDependency("./path/to/html.html", targetElement);
ModuleLoader.importDependency("./path/to/css.css");
ModuleLoader.importDependency("./path/to/js.js");
```

---

### importDependencies()

```js
ModuleLoader.importDependencies(<string[]>)
```

Loads multiple HTML, CSS, or JavaScript dependencies.

The method returns a promise that resolves when all dependencies have finished loading.

```js
await ModuleLoader.importDependencies([
  "./styles/main.css",
  "./styles/nav-bar.css",
  "./styles/page.css",
  "./scripts/page.js",
]);
```

---

### importModule()

```js
ModuleLoader.importModule(<string>)
```

Dynamically imports an ES module from the specified URL.

The returned promise resolves to the module's namespace object, allowing access to its exported values.

```js
const module = await ModuleLoader.importModule("./js-utils/Color.js");

console.log(module.Color);
```

---

### evalAndReturn()

```js
ModuleLoader.evalAndReturn(<string>, <string>)
```

Fetches and evaluates JavaScript source code, then returns the result of a specified expression.

Unlike `importModule()`, the source is not evaluated as an ES module and therefore does not support `import` or `export` syntax.

The first url argument must be a URL pointing to the JavaScript source.

The second `returnExpression` argument is a JavaScript expression, provided as a string. The result of this expression will be returned after the source has been evaluated.

> **[!] Warning**: This method uses new Function() to evaluate the fetched source. Only use it with trusted JavaScript sources and trusted expressions.

```js
const { add, subtract } = ModuleLoader.evalAndReturn(
  "./add-and-subtract-functions.js",
  `{ add: addFunc, subtract: subtractFunc }`,
);
```
