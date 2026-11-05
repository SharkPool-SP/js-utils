/**
 * Enable TypeScript-like type checking in runtime for all functions.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */

/**
 * Generic Type Classes
 *
 * @typedef {Class} Type Required Type
 */
class Any {}
class Real {}
class Null {}
class NullAny {}
class NullStr {}
class NullNum {}
class NullBool {}
class NullBigInt {}
class NullObject {}
class NullArray {}

/**
 * Another generic type class that checks if the value is an array of a specific type.
 * Used in conjunction with the `inType` method to enforce type checking on function parameters.
 *
 * @param {Type|Array<Type>} type The type or array of types that an array can contain.
 * @returns Callback function that checks if the value is an array of the specified type.
 */
const ArrayOf = function (type) {
  const runner = (array) => array.every((i) => isAOfTypeB(i, type));
  runner.__name = `Array of ${type.name}'s`;
  return runner;
};

/**
 * Gets the type of a given value.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {String} The type of the value.
 */
const getType = (value) => {
  if (value === null) return "null";
  if (Array.isArray(value)) return "Array";
  if (value?.constructor?.name) return value.constructor.name;
  return typeof value;
};

/**
 * Gets the string representation of a given value.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {String} The string representation of the value.
 */
const getValue = (value) => {
  try {
    return JSON.stringify(value) ?? String(value);
  } catch {
    return String(value);
  }
};

/**
 * Generates an error message for type mismatches in function arguments.
 *
 * @private
 * @param {Boolean} isArray Whether the expected type is an array.
 * @param {Function} target The function for which the error occurred.
 * @param {Number} i The index of the argument that caused the error.
 * @param {Type|Array<Type>} argument The expected type or array of types.
 * @param {*} passedArg The actual value passed as the argument.
 * @returns {String} The error message.
 */
const argErrorMsg = function (isArray, target, i, argument, passedArg) {
  let msg = "";
  msg += `TypeError:\nFunction: ${target.name || target}\n`;
  msg += `Parameter: ${i + 1}\n`;

  if (isArray) {
    msg += `Expected any of: ${argument.map((a) => a.__name ?? a.name).join(", ")}`;
  } else {
    msg += `Expected: ${argument.__name ?? argument.name}`;
  }

  msg += `\nReceived: ${getType(passedArg)}`;
  msg += `\nValue: ${getValue(passedArg)}`;

  return msg;
};

/**
 * Generates an error message for type mismatches in function return values.
 *
 * @private
 * @param {Boolean} isArray Whether the expected type is an array.
 * @param {Function} target The function for which the error occurred.
 * @param {Type|Array<Type>} argument The expected type or array of types.
 * @param {*} passedArg The actual value returned by the function.
 * @returns {String} The error message.
 */
const resErrorMsg = function (isArray, target, argument, passedArg) {
  let msg = "";
  msg += `TypeError:\nFunction: ${target.name || target}\n`;

  if (isArray) {
    msg += `Expected any return value of: ${argument.map((a) => a.__name ?? a.name).join(", ")}`;
  } else {
    msg += `Expected return value of: ${argument.__name ?? argument.name}`;
  }

  msg += `\nReceived: ${getType(passedArg)}`;
  msg += `\nValue: ${getValue(passedArg)}`;

  return msg;
};

/**
 * Checks if a value is of a specific type.
 *
 * @private
 * @param {*} A The value to check.
 * @param {*} B The expected type.
 * @returns {Boolean} Whether the value is of the expected type.
 */
const isAOfTypeB = function (A, B) {
  switch (B) {
    case String:
      return typeof A === "string";
    case Number:
      return typeof A === "number";
    case Boolean:
      return typeof A === "boolean";
    case Symbol:
      return typeof A === "symbol";
    case BigInt:
      return typeof A === "bigint";
    case Object:
      return A !== null && typeof A === "object" && !Array.isArray(A);
    case NullAny:
      return A !== undefined;
    case Real:
      return !(A === null || A === undefined);
    case Null:
      return A === null;
    case NullStr:
      return A == null || typeof A === "string";
    case NullNum:
      return A == null || typeof A === "number";
    case NullBool:
      return A == null || typeof A === "boolean";
    case NullBigInt:
      return A == null || typeof A === "bigint";
    case NullObject:
      return A == null || (typeof A === "object" && !Array.isArray(A));
    case NullArray:
      return A == null || Array.isArray(A);
    case Any:
      return true;
    default: {
      if (typeof B == "function" && B !== Function) {
        if (!B.toString().startsWith("class")) {
          return Array.isArray(A) && B(A);
        }
      }

      return A instanceof B;
    }
  }
};

/**
 * Adds type checking to function parameters.
 *
 * @example
 * (function add(a, b) {
 *    return a + b;
 * }).inType(String, [Number, NullNum])
 *
 * This will throw a TypeError if the first argument is not a string or the second argument is not a number or null.
 */
Object.defineProperty(Function.prototype, "inType", {
  value: function (...args) {
    return new Proxy(this, {
      apply(target, thisArg, funcArgs) {
        for (let i = 0; i < args.length; i++) {
          const argument = args[i];
          if (Array.isArray(argument)) {
            if (!argument.some((a) => isAOfTypeB(funcArgs[i], a))) {
              throw new TypeError(
                argErrorMsg(true, target, i, argument, funcArgs[i]),
              );
            }
          } else if (!isAOfTypeB(funcArgs[i], argument)) {
            throw new TypeError(
              argErrorMsg(false, target, i, argument, funcArgs[i]),
            );
          }
        }

        return Reflect.apply(target, thisArg, funcArgs);
      },
    });
  },
  writable: true,
  configurable: true,
});

/**
 * Adds type checking to function returns.
 *
 * @example
 * (function add(a, b) {
 *    return a + b;
 * }).outType([String, Number])
 *
 * This will throw a TypeError if the function does not return a string or number.
 */
Object.defineProperty(Function.prototype, "outType", {
  value: function (outputType) {
    return new Proxy(this, {
      apply(target, thisArg, funcArgs) {
        const value = Reflect.apply(target, thisArg, funcArgs);

        if (Array.isArray(outputType)) {
          if (!outputType.some((a) => isAOfTypeB(value, a))) {
            throw new TypeError(resErrorMsg(true, target, outputType, value));
          }
        } else if (!isAOfTypeB(value, outputType)) {
          throw new TypeError(resErrorMsg(false, target, outputType, value));
        }

        return value;
      },
    });
  },
  writable: true,
  configurable: true,
});

/**
 * Adds type checking to asyncronous function returns.
 *
 * @async
 * @example
 * (function add(a, b) {
 *    return a + b;
 * }).outType([String, Number])
 *
 * This will throw a TypeError if the function does not return a string or number.
 */
Object.defineProperty(Function.prototype, "outTypeAsync", {
  value: function (outputType) {
    return new Proxy(this, {
      async apply(target, thisArg, funcArgs) {
        const value = await Reflect.apply(target, thisArg, funcArgs);

        if (Array.isArray(outputType)) {
          if (!outputType.some((a) => isAOfTypeB(value, a))) {
            throw new TypeError(resErrorMsg(true, target, outputType, value));
          }
        } else if (!isAOfTypeB(value, outputType)) {
          throw new TypeError(resErrorMsg(false, target, outputType, value));
        }

        return value;
      },
    });
  },
  writable: true,
  configurable: true,
});

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
