# Typed-JS -- Runtime Type Checking

A lightweight utility that adds TypeScript-like runtime type checking to JavaScript functions. Allows developers to enforce parameter & return value types without requiring TypeScript, compilation, or additional build tools.

This utility extends `Function.prototype` with three methods: `inType()`, `outType()`, and `outTypeAsync()`.

## Generic Type Classes

Typed-JS supports native JavaScript constructors, including:

- `String`
- `Number`
- `Boolean`
- `Symbol`
- `BigInt`
- `Object`

Alongside that, this utility provides several generic type classes that can be used to validate other values. These classes are intended to be used as _type identifiers_ rather than be instantiated.

| Type         | Description                                            |
| ------------ | ------------------------------------------------------ |
| `Any`        | Accepts any value, including `null` and `undefined`    |
| `Real`       | Accepts any value except `null` and `undefined`        |
| `Null`       | Accepts only `null`                                    |
| `NullAny`    | Accepts any value except `undefined`, including `null` |
| `NullStr`    | Accepts strings or `null`                              |
| `NullNum`    | Accepts numbers or `null`                              |
| `NullBool`   | Accepts booleans or `null`                             |
| `NullBigInt` | Accepts BigInts or `null`                              |
| `NullObject` | Accepts non-array objects or `null`                    |
| `NullArray`  | Accepts arrays or `null`                               |
| `ArrayOf(X)` | Accepts arrays with items of a specified Type          |

> Native constructors are checked according to their corresponding JavaScript types. Other constructors are validated using `instanceof`.

## Methods

> **Note:** As mentioned previously, this utility _extends_ functionality for **all** functions.

### inType()

```js
Function.inType(<Type>, ...<Type>)
```

Adds runtime type checking to a function's parameters.

Each argument passed to `inType()` represents the expected type of the corresponding function parameter, starting from the first parameter.

If an argument does not satisfy its expected type, a `TypeError` is thrown before the original function executes.

The method returns a `Proxy` around the original function, preserving its original behavior and `this` context.

**Example:**

```js
function add(a, b) {
  return a + b;
}

const checkedAdd = add.inType(Number, Number); // Only allow numbers

checkedAdd(5, 10); // 15
checkedAdd(5, "10"); // TypeError

// Here is a more ideal way of declaring a Typed-Function:
(function add(a, b) {
  return a + b;
}).inType(Number, Number);
```

> **Note:** If a parameter does not have an expected type, it will not be validated and execute normally.

#### Union/Multi Types

An array of types can be supplied to allow multiple acceptable types for a parameter.

The parameter is considered valid if it matches _at least one_ of the specified types.

```js
(function print(value) {
  console.log(value);
}).inType([String, Number, Boolean]); // 'value' can be a string, number, or boolean.

print("Hello"); // Valid
print(123); // Valid
print(true); // Valid

print(null); // TypeError
```

#### Using Generic Types

Generic type classes can be used directly when defining parameter requirements.

```js
(function greet(name) {
  return `Hello, ${name ?? "stranger"}!`;
}).inType(NullStr);

greet("John"); // Valid
greet(null); // Valid

greet(undefined); // TypeError
greet(123); // TypeError
```

#### Using ArrayOf()

`ArrayOf()` creates a type-checking callback that validates whether an array contains values of a specified type.

It accepts either a single type or an array of acceptable types.

```js
ArrayOf(<Type | Array<Type>>)
```

The returned callback can be used with `inType()` like any other type definition.

```js
(function sum(numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}).inType(ArrayOf(Number));

sum([1, 2, 3, 4]); // 10

sum([1, 2, "3"]); // TypeError
```

Multiple types can also be specified:

```js
(function printValues(values) {
  console.log(values);
}).inType(ArrayOf([String, Number]));

printValues(["Hello", 123, "World"]); // Valid
printValues(["Hello", true]); // TypeError
```

---

### outType()

```js
Function.outType(<Type | Array<Type>>)
```

Adds runtime type checking to a function's return value.

The original function is executed first. Its return value is then checked against the specified type.

If the returned value does not satisfy the expected type, a `TypeError` is thrown.

The method, once again, returns a `Proxy` around the original function.

```js
(function add(a, b) {
  return a + b;
}).outType(Number);

add(5, 10); // 15

(function getName() {
  return 123;
}).outType(String);

getName(); // TypeError
```

#### Union Return Types

An array of types can be provided to allow multiple acceptable return types.

```js
(function getValue(condition) {
  return condition ? "Hello" : 123;
}).outType([String, Number]);

getValue(true); // Valid: "Hello"
getValue(false); // Valid: 123
```

The return value is valid if it matches at least one of the specified types.

#### Using Generic Types

Generic type classes and `ArrayOf()` can also be used to validate return values.

```js
(function getUsers() {
  return ["John", "Jane", "Alex"];
}).outType(ArrayOf(String));

getUsers(); // ["John", "Jane", "Alex"]
```

---

### outTypeAsync()

```js
Function.outTypeAsync(<Type | Array<Type>>)
```

Adds runtime type checking to the resolved return value of an **asynchronous** function.

Unlike `outType()`, this method awaits the original function's result before performing type validation.

Besides the above change in behaviour, it acts the same as `outType()`.

---

## Chaining

Out & In types can be chained together.

```js
(function advancedAdd(a, b) {
  if (b == null) {
    return null;
  }

  return a + b;
})
  .inType([String, Number], [String, Number, Null])
  .outType(NullAny);

advancedAdd(5, 3); // 8
advancedAdd("5", 3); // 53
advancedAdd("5", null); // null
advancedAdd(null, 5); // TypeError
```

## TypeError

When a parameter or return value fails validation, the called function throws a `TypeError` containing information about the mismatch.

The error message includes:

- **Function:** The name/code of the function that failed validation.
- **Parameter:** The position of the invalid parameter (for parameter errors).
- **Expected:** The required type or acceptable types.
- **Received:** The detected type of the provided value.
- **Value:** The string representation of the invalid value.

### Parameter Error Example

```js
function add(a, b) {
  return a + b;
}

const checked = add.inType(Number, Number);

checked(5, "Hello");
```

Example error:

```text
TypeError:
Function: add
Parameter: 2
Expected: Number
Received: String
Value: "Hello"
```

### Return Value Error Example

```js
function getNumber() {
  return "Hello";
}

const checked = getNumber.outType(Number);

checked();
```

Example error:

```text
TypeError:
Function: getNumber
Expected return value of: Number
Received: String
Value: "Hello"
```

## Exports

The following generic type classes and utilities are exported by the library:

```js
export {
  Any,
  Real,
  Null,
  NullAny,
  NullStr,
  NullNum,
  NullBool,
  NullBigInt,
  NullObject,
  NullArray,
  ArrayOf,
};
```

The `inType()`, `outType()`, and `outTypeAsync()` methods are installed directly on `Function.prototype` and therefore do not need to be imported individually.

All functions, lambdas, etc, can implement type checks.

## Use of Types in Classes

Applying runtime type checking to class methods requires a slightly different approach.

Since `inType()`, `outType()`, & `outTypeAsync()` return new functions rather than modifying the original method, the returned function must be reassigned to the class instance's property.

This can be done either inside the constructor or externally after creating an instance.

```js
class MathUtils {
  add(a, b) {
    return a + b;
  }

  constructor() {
    // Add this to add type checks:
    this.add = this.add.inType(Number, Number).bind(this);

    // The `.bind(this)` call ensures that the original method retains its class instance
    // as its this context. Under certain circumstances, it may be optional.
  }
}

const mathUtils = new MathUtils();
mathUtils.add(5, 5); // 10
mathUtils.add("5", "5"); // TypeError
```
