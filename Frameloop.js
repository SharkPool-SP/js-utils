/**
 * Run game loops within a frame-based system.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */

const REFRESH_RATE = 1000 / 60;
const _requestAnimationFrame =
  typeof requestAnimationFrame === "function"
    ? requestAnimationFrame
    : (f) => setTimeout(f, REFRESH_RATE);

const _cancelAnimationFrame =
  typeof requestAnimationFrame === "function"
    ? cancelAnimationFrame
    : clearTimeout;

class FrameLoop {
  /**
   * Constructs a FrameLoop object.
   *
   * @param {Number} framerate (optional) determines what framerate to run this loop at
   */
  constructor(framerate = 60) {
    this.running = false;
    this.listeners = [];
    this.framerate = null;
    this.isAnimationLoop = null;

    this._frameListener = null;
    this.callback = this.callback.bind(this);
    this.setFramerate(framerate);
  }

  /**
   * Callback function used by the loop.
   *
   * @private
   */
  callback() {
    if (this.listeners.length) {
      for (const func of this.listeners) func();
    }

    if (this.isAnimationLoop && this.running) {
      this._frameListener = _requestAnimationFrame(this.callback);
    }
  }

  /**
   * Starts the frame loop.
   */
  start() {
    if (this.running) return;

    this.running = true;
    if (this.isAnimationLoop) {
      this._frameListener = _requestAnimationFrame(this.callback);
    } else {
      this._frameListener = setInterval(this.callback, this.framerate);
    }
  }

  /**
   * Stops the frame loop.
   */
  stop() {
    if (!this.running) return;

    this.running = false;
    if (this.isAnimationLoop) {
      _cancelAnimationFrame(this._frameListener);
    } else {
      clearInterval(this._frameListener);
    }
  }

  /**
   * Sets the framerate of this frame loop
   *
   * @param {Number} fps The new framerate. Use '0' to for the user screen-refresh rate
   */
  setFramerate(fps) {
    const normalized = fps ? 1000 / Math.max(0, Math.round(fps)) : 0;
    if (normalized === this.framerate) return;

    this.framerate = normalized;
    if (this.running) {
      if (this.isAnimationLoop) {
        // we know the new framerate cannot be less than or equal to 0
        _cancelAnimationFrame(this._frameListener);
        this._frameListener = setInterval(this.callback, normalized);
      } else {
        clearInterval(this._frameListener);
        this._frameListener =
          normalized > 0
            ? setInterval(this.callback, normalized)
            : _requestAnimationFrame(this.callback);
      }
    }

    this.isAnimationLoop = this.framerate === 0;
  }

  /**
   * Add a custom listener to the frame loop.
   *
   * @param {Function} func function that is called on every frame
   */
  onFrame(func) {
    if (typeof func === "function") {
      this.listeners.push(func);
    }
  }

  /**
   * Removes a custom listener from the frame loop.
   *
   * @param {Function} func function to remove from the loop
   */
  offFrame(func) {
    if (typeof func === "function") {
      const index = this.listeners.indexOf(func);
      if (index > -1) this.listeners.splice(index, 1);
    }
  }
}

export { FrameLoop };
