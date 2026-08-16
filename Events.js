/**
 * Dispatch and handle custom events.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class Events {
  static _events = new Map();

  /**
   * Gets the data of an event.
   *
   * @private
   * @param {String} eventName name identifier of the event
   * @returns Event data if exists, otherwise undefined
   */
  static _getEvent(eventName) {
    const name = String(eventName);

    return Events._events.get(name);
  }

  /**
   * Creates a new event data object.
   *
   * @private
   * @param {String} eventName name identifier of the event
   * @returns New event data object
   */
  static _newEvent(eventName) {
    const name = String(eventName);

    // Early exist if event already exists
    if (Events._events.has(name)) return Events._getEvent(name);

    const eventData = {
      max: null, // null represents Infinity
      listeners: [],
    };

    this._events.set(name, eventData);

    return eventData;
  }

  /**
   * Checks if a new listener can be added to an event.
   *
   * @private
   * @param {String} eventName name identifier of the event
   * @param {Object} eventData Event data object
   * @returns true if a new listener can be added
   */
  static _canListen(eventName, eventData) {
    if (eventData.max !== null && eventData.listeners.length >= eventData.max) {
      console.warn(
        `Events.js: MAX LISTENERS REACHED (${Events.getMaxListeners(eventData.name)}) '${eventName}'`,
      );

      return false;
    }

    return true;
  }

  /**
   * Validates a function.
   *
   * @private
   * @param {Function} func Function to validate
   */
  static _validateFunction(func) {
    if (typeof func !== "function") {
      throw new Error("Events.js: Parameter must be a function!");
    }
  }

  /**
   * Dispatches an event to it's listeners.
   *
   * @param {String} eventName the name of the event to dispatch
   * @param {...*} optData additional arguments passed to each listener
   */
  static emit(eventName, ...args) {
    const eventData = Events._getEvent(eventName);
    if (!eventData) return;

    const listeners = eventData.listeners;
    for (let i = 0; i < listeners.length; i++) listeners[i](...args);
  }

  /**
   * Dispatches a request event to it's listeners and returns
   * an array containing each listener's return value.
   *
   * @param {string} eventName the name of the event to dispatch
   * @param {...*} optData additional arguments passed to each listener
   * @returns {Array<*>} An array of values returned by the event listeners
   *
   * @see {@link Events.requestAsync} for the asynchronous version.
   */
  static request(eventName, ...args) {
    const eventData = Events._getEvent(eventName);
    if (!eventData) return undefined;

    const listeners = eventData.listeners;
    const results = new Array(listeners.length);
    for (let i = 0; i < listeners.length; i++) {
      results[i] = listeners[i](...args);
    }

    return results;
  }

  /**
   * Same as {@link Events.request}, but runs each listener asynchronously
   * and waits for all results to resolve.
   *
   * @see {@link Events.request} for the synchronous version.
   */
  static async requestAsync(eventName, ...args) {
    const eventData = Events._getEvent(eventName);
    if (!eventData) return undefined;

    const listeners = eventData.listeners;
    const promises = new Array(listeners.length);
    for (let i = 0; i < listeners.length; i++) {
      promises[i] = listeners[i](...args);
    }

    return Promise.all(promises);
  }

  /**
   * Append a listener to a custom event.
   *
   * @param {String} eventName name identifier of the event
   * @param {Function} func event dispatch callback
   */
  static on(eventName, func) {
    Events._validateFunction(func);

    const eventData = Events._newEvent(eventName);
    if (Events._canListen(eventName, eventData)) eventData.listeners.push(func);
  }

  /**
   * Append a listener to a custom event. Will run before all other listeners.
   *
   * @param {String} eventName name identifier of the event
   * @param {Function} func event dispatch callback
   */
  static before(eventName, func) {
    Events._validateFunction(func);

    const eventData = Events._newEvent(eventName);
    if (Events._canListen(eventName, eventData)) {
      eventData.listeners.unshift(func);
    }
  }

  /**
   * Appends a listener to a custom event. Runs once.
   *
   * @param {String} eventName name identifier of the event
   * @param {Function} func event dispatch callback
   */
  static once(eventName, func) {
    Events._validateFunction(func);

    const wrapper = function (...data) {
      Events.off(eventName, wrapper);
      return func(...data);
    };

    Events.on(eventName, wrapper);
  }

  /**
   * Remove a listener(s) from a custom event. Will remove all listeners if
   * second parameter is not provided.
   *
   * @param {String} eventName name identifier of the event
   * @param {Function} optFunc specific function to remove
   */
  static off(eventName, optFunc) {
    const eventData = Events._getEvent(eventName);
    if (!eventData) return;

    if (typeof optFunc === "function") {
      eventData.listeners = eventData.listeners.filter((f) => f !== optFunc);
    } else {
      // No function provided, remove all listeners
      Events._events.delete(String(eventName));
    }
  }

  /**
   * Removes all listeners and custom events.
   */
  static flush() {
    Events._events.clear();
  }

  /**
   * Sets the max number of listeners an event can have.
   *
   * @param {String} eventName name identifier of the event
   * @param {Number|null} amount The max amount of listeners an event can have
   */
  static setMaxListeners(eventName, amount) {
    const eventData = Events._newEvent(eventName);
    eventData.max = amount === null ? null : Number(amount);
  }

  /**
   * Gets the max number of listeners an event can have.
   *
   * @param {String} eventName name identifier of the event
   * @returns max listeners
   */
  static getMaxListeners(eventName) {
    const eventData = Events._getEvent(eventName);
    if (!eventData) return null;

    return eventData.max === null ? Infinity : eventData.max;
  }
}

export { Events };
