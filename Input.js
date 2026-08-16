/**
 * Utilities for keyboard and mouse input detection.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class Input {
  /** Keyboard */
  static KEYBOARD_UTILS = class KeyboardUtils {
    /**
     * Converts a KeyboardEvent key to its proper english name.
     *
     * @param {KeyboardEvent} event keyboard event
     * @returns proper key name
     */
    static getKeyName(event) {
      let name;
      name = event.key.toLowerCase();

      if (name.startsWith("arrow")) {
        name = name.replace("arrow", "") + " arrow";
        return name; // eg: left arrow
      }

      if (name.startsWith("page")) {
        name = name.replace("page", "page ");
        return name; // eg: page up
      }

      switch (name) {
        case " ":
          return "space";
        case "printscreen":
          return "print screen";
        case "numlock":
          return "num lock";
        case "capslock":
          return "caps lock";
        case "audiovolumemute":
          return "volume mute";
        case "audiovolumedown":
          return "volume down";
        case "audiovolumeup":
          return "volume up";
        case "mediastop":
          return "media stop";
        case "mediaplaypause":
          return "media playpause";
        case "mediatrackprevious":
          return "media previous";
        case "mediatracknext":
          return "media next";
        default: {
          if (name.length > 2) {
            return name; // special char eg. shift or f12
          }

          if (Input.CAPS_LOCK_ENABLED !== event.shiftKey) {
            name = name.toUpperCase();
          }

          return name;
        }
      }
    }
  };

  static KEY_LISTENERS = [];
  static KEYS_DOWN = new Map();
  static CAPS_LOCK_ENABLED = false;

  static _keyDownListener = window.addEventListener(
    "keydown",
    Input.keydownHandler,
  );
  static _keyUpListener = window.addEventListener("keyup", Input.keyupHandler);

  /**
   * Handler for key down events.
   *
   * @param {KeyboardEvent} event called by keydown
   * @private
   */
  static keydownHandler(event) {
    const properName = Input.KEYBOARD_UTILS.getKeyName(event);
    Input.KEYS_DOWN.set(properName, event);

    if (properName === "caps lock") {
      Input.CAPS_LOCK_ENABLED = event.getModifierState("CapsLock");
    }

    for (const func of Input.KEY_LISTENERS) func(event, "keydown");
  }

  /**
   * Handler for key up events.
   *
   * @param {KeyboardEvent} event called by keyup
   * @private
   */
  static keyupHandler(event) {
    const properName = Input.KEYBOARD_UTILS.getKeyName(event);
    Input.KEYS_DOWN.delete(properName);

    for (const func of Input.KEY_LISTENERS) func(event, "keyup");
  }

  /**
   * Checks if a requested key is down.
   *
   * @param {String} keyName proper/inproper name of the key to be checked
   * @param {Boolean} opt_ignoreCase (optional) if true, allows key 'a' and 'A' to return the same result
   * @returns true if the requested key is down
   */
  static isKeyDown(keyName, opt_ignoreCase) {
    const properName = Input.KEYBOARD_UTILS.getKeyName({
      key: keyName,
      shiftKey: false,
    });

    return (
      Input.KEYS_DOWN.has(keyName) ||
      (opt_ignoreCase
        ? Input.KEYS_DOWN.has(properName) ||
          Input.KEYS_DOWN.has(keyName.toUpperCase())
        : false)
    );
  }

  /**
   * Returns all the keys currently pressed.
   *
   * @returns an array of keys currently down
   */
  static getKeysDown() {
    const keys = [];
    Input.KEYS_DOWN.forEach((_, name) => {
      keys.push(name);
    });

    return keys;
  }

  /**
   * @callback KeyboardCallback
   * @param {KeyboardEvent} event the keyboard event captured
   * @param {string} type the keyboard event type
   */
  /**
   * Add a custom listener for keyboard events.
   *
   * @param {KeyboardCallback, Function} func function that is called on key down and key up
   */
  static addKeyHandler(func) {
    if (typeof func === "function") {
      Input.KEY_LISTENERS.push(func);
    }
  }

  /**
   * Removes a custom key events listener.
   *
   * @param {KeyboardCallback, Function} func function to remove (used in 'addKeyHandler')
   */
  static removeKeyHandler(func) {
    if (typeof func === "function") {
      const index = Input.KEY_LISTENERS.indexOf(func);
      if (index > -1) Input.KEY_LISTENERS.splice(index, 1);
    }
  }

  /** Mouse */
  static MOUSE_LISTENERS = [];
  static MOUSE_DOWN = false;
  static MOUSE_LAST_BUTTON = null;
  static MOUSE_TIMESTAMPS = {
    downTime: 0,
    upTime: 0,
  };

  static MOUSE_X = null;
  static MOUSE_Y = null;

  static _mouseDownListener = window.addEventListener(
    "mousedown",
    Input.mousedownHandler,
  );
  static _mouseUpListener = window.addEventListener(
    "mouseup",
    Input.mouseupHandler,
  );
  static _mouseMoveListener = window.addEventListener(
    "mousemove",
    Input.mousemoveHandler,
  );

  /**
   * Handler for mouse down events.
   *
   * @param {MouseEvent} event called by mousedown
   * @private
   */
  static mousedownHandler(event) {
    Input.MOUSE_DOWN = true;
    Input.MOUSE_TIMESTAMPS.downTime = event.timeStamp;
    Input.MOUSE_TIMESTAMPS.delta = 0;
    Input.MOUSE_LAST_BUTTON = event.button;

    Input.MOUSE_X = event.clientX;
    Input.MOUSE_Y = event.clientY;

    for (const func of Input.MOUSE_LISTENERS) func(event, "mousedown");
  }

  /**
   * Handler for mouse up events.
   *
   * @param {MouseEvent} event called by mouseup
   * @private
   */
  static mouseupHandler(event) {
    Input.MOUSE_DOWN = false;
    Input.MOUSE_TIMESTAMPS.upTime = event.timeStamp;
    Input.MOUSE_X = event.clientX;
    Input.MOUSE_Y = event.clientY;

    for (const func of Input.MOUSE_LISTENERS) func(event, "mouseup");
  }

  /**
   * Handler for mouse move events.
   *
   * @param {MouseEvent} event called by mousemove
   * @private
   */
  static mousemoveHandler(event) {
    Input.MOUSE_X = event.clientX;
    Input.MOUSE_Y = event.clientY;

    for (const func of Input.MOUSE_LISTENERS) func(event, "mousemove");
  }

  /**
   * @callback MouseCallback
   * @param {MouseEvent} event the mouse event captured
   * @param {string} type the mouse event type
   */
  /**
   * Add a custom listener for mouse events.
   *
   * @param {MouseCallback, Function} func function that is called on mouse down, up, and move
   */
  static addMouseHandler(func) {
    if (typeof func === "function") {
      Input.MOUSE_LISTENERS.push(func);
    }
  }

  /**
   * Removes a custom mouse events listener.
   *
   * @param {MouseCallback, Function} func function to remove (used in 'addMouseHandler')
   */
  static removeMouseHandler(func) {
    if (typeof func === "function") {
      const index = Input.MOUSE_LISTENERS.indexOf(func);
      if (index > -1) Input.MOUSE_LISTENERS.splice(index, 1);
    }
  }

  /**
   * Returns whether or not the mouse is pressed down.
   *
   * @returns true if the mouse is pressed down
   */
  static isMouseDown() {
    return Input.MOUSE_DOWN;
  }

  /**
   * Returns whether or not the mouse is clicked.
   *
   * @param {Number} opt_bound (optional) range precision in milliseconds
   * @returns true if the mouse is clicked
   */
  static isMouseClicked(opt_bound) {
    const delta = performance.now() - Input.MOUSE_TIMESTAMPS.downTime;
    return Input.MOUSE_DOWN && delta < (opt_bound ?? 50);
  }

  /**
   * Returns the last button pressed on the mouse (left, right, etc.)
   *
   * @returns Last button pressed on the mouse
   */
  static getLastMouseButtonPressed() {
    return Input.MOUSE_LAST_BUTTON;
  }

  /**
   * Returns the mouse position.
   *
   * @param {Boolean} opt_useCenter if true, will make the returned value relative to the screen center
   * @returns an array containing the mouse x and y
   */
  static getMousePosition(opt_useCenter) {
    if (opt_useCenter) {
      return [
        Input.MOUSE_X - window.innerWidth / 2,
        -(Input.MOUSE_Y - window.innerHeight / 2),
      ];
    }

    return [Input.MOUSE_X, Input.MOUSE_Y];
  }
}

export { Input };
