/**
 * Utilities for interpolating (tweening) numbers in several ways.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class Tween {
  /** Ease Types */

  /**
   * Ease type to use for tweening.
   * @typedef {Number} EaseType
   */
  static EASE_IN_OUT = 0;
  static EASE_IN = 1;
  static EASE_OUT = 2;

  /** Easing Constants */
  static BACK_OVERSHOOT = 1.70158;

  static ELASTIC_PERIOD = (2 * Math.PI) / 3;
  static ELASTIC_INOUT_PERIOD = (2 * Math.PI) / 4.5;

  static BOUNCE_MULTIPLIER = 7.5625;
  static BOUNCE_DIVISOR = 2.75;
  static BOUNCE_THRESHOLDS = {
    1: 1 / Tween.BOUNCE_DIVISOR,
    1.5: 1.5 / Tween.BOUNCE_DIVISOR,
    2: 2 / Tween.BOUNCE_DIVISOR,
    2.5: 2.25 / Tween.BOUNCE_DIVISOR,
    3: 2.5 / Tween.BOUNCE_DIVISOR,
    3.5: 2.625 / Tween.BOUNCE_DIVISOR,
  };

  /** Utilities */
  /**
   * Constraint a number inbetween a min and max value.
   *
   * @param {Number} min smallest possible value
   * @param {Number} max biggest possible value
   * @param {Number} value the number to be constraint
   * @returns constraint number
   */
  static clamp(min, max, value) {
    return Math.min(max, Math.max(min, value));
  }

  /**
   * Transitions a number linearly to another number.
   *
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns interpolated number
   */
  static lerp(start, end, alpha) {
    return start + (end - start) * alpha;
  }

  /**
   * Centralized handler for symmetric base curve tweens.
   *
   * @private
   * @param {EaseType} ease the type of easing to use
   * @param {Number} alpha range from 0-1 (start-end)
   * @param {Function} handler symmetric base curve handler
   * @returns evaluated tween handler
   */
  static _resolveEase(ease, alpha, handler) {
    switch (ease) {
      case Tween.EASE_IN:
        return handler(alpha);
      case Tween.EASE_OUT:
        return 1 - handler(1 - alpha);
      case Tween.EASE_IN_OUT:
        return alpha < 0.5
          ? handler(alpha * 2) * 0.5
          : (1 - handler(2 - alpha * 2)) * 0.5 + 0.5;
      default:
        return alpha;
    }
  }

  /**
   * Sinusoidal easing.
   * Creates a smooth acceleration and deceleration.
   *
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns tweened value
   */
  static sine(ease, start, end, alpha) {
    const handler = (t) => 1 - Math.cos(t * Math.PI * 0.5);
    const value = Tween._resolveEase(ease, alpha, handler);

    return Tween.lerp(start, end, value);
  }

  /**
   * Quadratic easing.
   * Creates a parabolic acceleration curve.
   *
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns tweened value
   */
  static quad(ease, start, end, alpha) {
    const handler = (t) => t * t;
    const value = Tween._resolveEase(ease, alpha, handler);

    return Tween.lerp(start, end, value);
  }

  /**
   * Cubic easing.
   * Stronger acceleration curve than quadratic.
   *
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns tweened value
   */
  static cubic(ease, start, end, alpha) {
    const handler = (t) => t ** 3;
    const value = Tween._resolveEase(ease, alpha, handler);

    return Tween.lerp(start, end, value);
  }

  /**
   * Quartic easing.
   * Very steep acceleration curve.
   *
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns tweened value
   */
  static quart(ease, start, end, alpha) {
    const handler = (t) => t ** 4;
    const value = Tween._resolveEase(ease, alpha, handler);

    return Tween.lerp(start, end, value);
  }

  /**
   * Quintic easing.
   * Extremely sharp acceleration curve.
   *
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns tweened value
   */
  static quint(ease, start, end, alpha) {
    const handler = (t) => t ** 5;
    const value = Tween._resolveEase(ease, alpha, handler);

    return Tween.lerp(start, end, value);
  }

  /**
   * Exponential easing.
   * Moves exponentially with fast acceleration or deceleration near the edges.
   *
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns tweened value
   */
  static expo(ease, start, end, alpha) {
    if (alpha === 0) return start;
    if (alpha === 1) return end;

    const handler = (t) => 2 ** (10 * t - 10);
    const value = Tween._resolveEase(ease, alpha, handler);

    return Tween.lerp(start, end, value);
  }

  /**
   * Circular easing.
   * Follows a circular curve with softer motion than exponential easing.
   *
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns tweened value
   */
  static circ(ease, start, end, alpha) {
    const handler = (t) => 1 - Math.sqrt(1 - t ** 2);
    const value = Tween._resolveEase(ease, alpha, handler);

    return Tween.lerp(start, end, value);
  }

  /**
   * Back easing.
   * Overshoots slightly before settling at the final value.
   * Creates a "pull back and release" effect.
   *
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns tweened value
   */
  static back(ease, start, end, alpha) {
    let value;

    switch (ease) {
      case Tween.EASE_IN:
        value =
          (Tween.BACK_OVERSHOOT + 1) * alpha ** 3 -
          Tween.BACK_OVERSHOOT * alpha ** 2;
        break;
      case Tween.EASE_OUT:
        value =
          1 +
          (Tween.BACK_OVERSHOOT + 1) * (alpha - 1) ** 3 +
          Tween.BACK_OVERSHOOT * (alpha - 1) ** 2;
        break;
      case Tween.EASE_IN_OUT: {
        const c2 = Tween.BACK_OVERSHOOT * 1.525;
        alpha *= 2;

        value =
          alpha >= 1
            ? ((alpha - 2) ** 2 * ((c2 + 1) * (alpha - 2) + c2) + 2) * 0.5
            : alpha ** 2 * ((c2 + 1) * alpha - c2) * 0.5;
        break;
      }
      default:
        value = alpha;
    }

    return Tween.lerp(start, end, value);
  }

  /**
   * Elastic easing.
   * Simulates a spring-like effect with multiple overshoots.
   *
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns tweened value
   */
  static elastic(ease, start, end, alpha) {
    let value;

    switch (ease) {
      case Tween.EASE_IN:
        if (alpha === 0) value = 0;
        else if (alpha === 1) value = 1;
        else {
          alpha *= 10;
          value =
            -(2 ** (alpha - 10)) *
            Math.sin((alpha - 10.75) * Tween.ELASTIC_PERIOD);
        }
        break;
      case Tween.EASE_OUT:
        if (alpha === 0) value = 0;
        else if (alpha === 1) value = 1;
        else {
          alpha *= 10;
          value =
            2 ** -alpha * Math.sin((alpha - 0.75) * Tween.ELASTIC_PERIOD) + 1;
        }
        break;
      case Tween.EASE_IN_OUT:
        if (alpha === 0) value = 0;
        else if (alpha === 1) value = 1;
        else if (alpha >= 0.5) {
          alpha *= 20;
          value =
            2 ** (-alpha + 10) *
              Math.sin((alpha - 11.125) * Tween.ELASTIC_INOUT_PERIOD) *
              0.5 +
            1;
        } else {
          alpha *= 20;
          value =
            -(
              2 ** (alpha - 10) *
              Math.sin((alpha - 11.125) * Tween.ELASTIC_INOUT_PERIOD)
            ) * 0.5;
        }
        break;
      default:
        value = alpha;
    }

    return Tween.lerp(start, end, value);
  }

  /**
   * Bounce easing.
   * Simulates an object bouncing against a surface with
   * its rebound diminishing before settling.
   *
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start starting number
   * @param {Number} end ending number
   * @param {Number} alpha range from 0-1 (start-end)
   * @returns tweened value
   */
  static bounce(ease, start, end, alpha) {
    let value;

    switch (ease) {
      case Tween.EASE_IN:
        value = 1 - Tween.bounce(Tween.EASE_OUT, 0, 1, 1 - alpha);
        break;
      case Tween.EASE_OUT:
        if (alpha < Tween.BOUNCE_THRESHOLDS[1]) {
          value = Tween.BOUNCE_MULTIPLIER * alpha ** 2;
        } else if (alpha < Tween.BOUNCE_THRESHOLDS[2]) {
          alpha -= Tween.BOUNCE_THRESHOLDS[1.5];
          value = Tween.BOUNCE_MULTIPLIER * alpha ** 2 + 0.75;
        } else if (alpha < Tween.BOUNCE_THRESHOLDS[3]) {
          alpha -= Tween.BOUNCE_THRESHOLDS[2.5];
          value = Tween.BOUNCE_MULTIPLIER * alpha ** 2 + 0.9375;
        } else {
          alpha -= Tween.BOUNCE_THRESHOLDS[3.5];
          value = Tween.BOUNCE_MULTIPLIER * alpha ** 2 + 0.984375;
        }
        break;
      case Tween.EASE_IN_OUT:
        alpha *= 2;
        value =
          alpha >= 1
            ? (1 + Tween.bounce(Tween.EASE_OUT, 0, 1, alpha - 1)) * 0.5
            : (1 - Tween.bounce(Tween.EASE_OUT, 0, 1, 1 - alpha)) * 0.5;
        break;
      default:
        value = alpha;
    }

    return Tween.lerp(start, end, value);
  }

  /**
   * Constructs a Tween object. Used for tweening a value and getting its current tweened value in a central place.
   *
   * @param {*} tweenFunc
   * @param {EaseType} ease the type of easing to use
   * @param {Number} start the starting value
   * @param {Number} end the end value
   * @param {Number} transitionTime how long in seconds this tween will take TODO
   */
  constructor(tweenFunc, ease, start, end, transitionTime) {
    if (!tweenFunc || typeof tweenFunc !== "function") {
      throw new Error("Invalid tween updater function in Tween constructor.");
    }

    if (
      typeof start !== "number" ||
      typeof end !== "number" ||
      typeof transitionTime !== "number"
    ) {
      throw new Error(
        "Invalid start, end, or transition time in Tween constructor.",
      );
    }

    this._func = tweenFunc;
    this._ease = ease ?? Tween.EASE_IN_OUT;
    this.start = start;
    this.end = end;
    this.interval = transitionTime;

    this._initTime = null;
    this._value = null;

    /* Accessing tween.value will automatically increment the progression of the transformation */
    Object.defineProperty(this, "value", {
      enumerable: true,
      configurable: false,
      get() {
        const now = performance.now();
        if (this._initTime === null) this._initTime = now;

        const alpha = Tween.clamp(
          0,
          1,
          ((now - this._initTime) * 0.001) / this.interval,
        );

        this._value = this._func(this._ease, this.start, this.end, alpha);
        return this._value;
      },
    });
  }
}

export { Tween };
