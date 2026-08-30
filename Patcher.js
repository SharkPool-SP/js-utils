/**
 * Monkeypatch functions and object properties.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class Patcher {
  /**
   * Original source functions.
   * Key is the new function, value is the old original.
   * @type {Map<Function, Function>}
   */
  static ORIGINAL_FUNCS = new Map();

  /**
   * @typedef {Function} PatchFunction
   * Patch callback invoked before or after the original function.
   *
   * @this {*} Original function context (`this`)
   * @param {*} returnValue Return value of the original function. `null` when invoked before the original function.
   * @param {...*} args Arguments passed to the original function
   * @returns {*} For before-patches, any returned value replaces the arguments to the original function. An array
   *              replaces all arguments, while any other non-null value becomes the only argument.
   *              For after-patches, any returned value replaces the return value. Returning `null` or `undefined`
   *              preserves the original behavior.
   */

  /**
   * Inject a function to run before a specified function.
   *
   * @param {Function} srcFunc Original function to patch
   * @param {PatchFunction} func Patch runner function
   * @returns {Function} New patched function
   */
  static patchBefore(srcFunc, func) {
    const patch = function (...args) {
      const newArgs = func.call(this, null, ...args);
      if (newArgs !== null && newArgs !== undefined) {
        if (Array.isArray(newArgs)) args = newArgs;
        else args = [newArgs];
      }

      return srcFunc.call(this, ...args);
    };

    Patcher.ORIGINAL_FUNCS.set(patch, srcFunc);
    return patch;
  }

  /**
   * Inject a function to run before a specified function, asynchronously.
   *
   * @param {Function} srcFunc Original function to patch
   * @param {PatchFunction} func Patch runner function
   * @returns {Function} New patched function
   */
  static patchBeforeAsync(srcFunc, func) {
    const patch = async function (...args) {
      const newArgs = await func.call(this, null, ...args);
      if (newArgs !== null && newArgs !== undefined) {
        if (Array.isArray(newArgs)) args = newArgs;
        else args = [newArgs];
      }

      return srcFunc.call(this, ...args);
    };

    Patcher.ORIGINAL_FUNCS.set(patch, srcFunc);
    return patch;
  }

  /**
   * Inject a function to run after a specified function.
   *
   * @param {Function} srcFunc Original function to patch
   * @param {PatchFunction} func Patch runner function
   * @returns {Function} New patched function
   */
  static patchAfter(srcFunc, func) {
    const patch = function (...args) {
      const returnValue = srcFunc.call(this, ...args);
      const patchReturnValue = func.call(this, returnValue, ...args);

      return patchReturnValue ?? returnValue;
    };

    Patcher.ORIGINAL_FUNCS.set(patch, srcFunc);
    return patch;
  }

  /**
   * Inject a function to run after a specified function, asynchronously.
   *
   * @param {Function} srcFunc Original function to patch
   * @param {PatchFunction} func Patch runner function
   * @returns {Function} New patched function
   */
  static patchAfterAsync(srcFunc, func) {
    const patch = async function (...args) {
      const returnValue = await srcFunc.call(this, ...args);
      const patchReturnValue = await func.call(this, returnValue, ...args);

      return patchReturnValue ?? returnValue;
    };

    Patcher.ORIGINAL_FUNCS.set(patch, srcFunc);
    return patch;
  }

  /**
   * Gets the original unpatched function of a specified patched function.
   *
   * @param {Function} func Patched function to retrieve the original from
   * @returns {Function|null} Original function, if found
   */
  static getOriginal(func) {
    if (Patcher.ORIGINAL_FUNCS.has(func)) {
      return Patcher.ORIGINAL_FUNCS.get(func);
    }

    return null;
  }

  /**
   * @typedef PropertyCallbackObject
   * @property {Function} beforeGet Callback that runs before accessing a property
   * @property {Function} get Alias to 'beforeGet'
   * @property {Function} beforeSet Callback that runs before setting a property
   * @property {Function} afterSet Callback that runs after setting a property
   */

  /**
   * Listens to a property set/get action in a specified object.
   *
   * @param {Object} object Object containing requested property
   * @param {String} property Property to attach listener to
   * @param {PropertyCallbackObject} callbacks Object of callbacks to run
   */
  static listenProperty(object, property, callbacks = {}) {
    const getCB = callbacks.beforeGet ?? callbacks.get;
    const beforeSetCB = callbacks.beforeSet;
    const afterSetCB = callbacks.afterSet;

    const valueKey = Symbol(`patcher_raw_${property}`);
    const descriptor = Object.getOwnPropertyDescriptor(object, property);

    object[valueKey] = object[property];

    Object.defineProperty(object, property, {
      get() {
        if (getCB) getCB(this[valueKey]);
        return this[valueKey];
      },
      set(value) {
        if (beforeSetCB) beforeSetCB(value);
        this[valueKey] = value;
        if (afterSetCB) afterSetCB(value);
      },
      enumerable: descriptor?.enumerable ?? true,
      configurable: descriptor?.configurable ?? true,
    });
  }
}

export { Patcher };
