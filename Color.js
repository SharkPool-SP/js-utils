/**
 * Various color utilities and functions.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class Color {
  /* Supported Color Formats */
  // basic hexadecimal color
  static TYPE_HEX = 0;

  /**
   * @typedef {object} RGBAObject - An object representing a color in RGBA format.
   *
   * @property {number} r - red value, ranged from 0-255
   * @property {number} g - green value, ranged from 0-255
   * @property {number} b - blue value, ranged from 0-255
   * @property {number} a - alpha/opacity value, ranged from 0-1
   */
  static TYPE_RGBA = 1;

  /**
   * @typedef {number[]} ColorVector - An array representing a color in color vector format.
   *
   * @property {number} 0 - red value, ranged from 0-1
   * @property {number} 1 - green value, ranged from 0-1
   * @property {number} 2 - blue value, ranged from 0-1
   * @property {number} 3 - alpha/opacity value, ranged from 0-1
   */
  static TYPE_VECTOR = 2;

  /**
   * @typedef {object} HSVAObject - An object representing a color in HSVA format.
   *
   * @property {number} h - hue, ranged from 0-359
   * @property {number} s - saturation, ranged from 0-1
   * @property {number} v - value, ranged from 0-1
   * @property {number} a - alpha/opacity, ranged from 0-1
   */
  static TYPE_HSVA = 3;

  /* Supported Blend Modes */
  static BLEND_ADD = 0;
  static BLEND_SUBTRACT = 1;
  static BLEND_MULTIPLY = 2;

  /* default (black) color */
  static BLACK_HEX = "#000000";

  /** @type {RGBAObject} */
  static BLACK_RGBA = { r: 0, g: 0, b: 0, a: 1 };

  /** @type {ColorVector} */
  static BLACK_VECTOR = [0, 0, 0, 1];

  /** @type {HSVAObject} */
  static BLACK_HSVA = { h: 0, s: 0, v: 0, a: 1 };

  /* Math Constants */
  static INV_255 = 1 / 255;

  /* Conversions */
  /**
   * Converts a Hex color to a specified type.
   *
   * @param {String} hex hexadecimal color code
   * @param {number} colorType supported color type (Color.TYPE_RGBA, Color.TYPE_VECTOR, etc.)
   * @returns specified converted color (rgba, vector, etc.)
   */
  static hexToType(hex, colorType) {
    if (!hex) hex = Color.BLACK_HEX;
    hex = hex.replace("#", "").toLowerCase();

    if (hex.length < 6) return null;

    // append alpha tag
    if (hex.length < 7) hex += "ff";

    switch (colorType) {
      case Color.TYPE_RGBA: {
        const rgba = {};
        for (let i = 0; i < hex.length; i += 2) {
          const bit = hex[i] + hex[i + 1];
          if (i == 0) rgba.r = parseInt(bit, 16);
          else if (i == 2) rgba.g = parseInt(bit, 16);
          else if (i == 4) rgba.b = parseInt(bit, 16);
          else rgba.a = parseInt(bit, 16) * Color.INV_255;
        }

        return rgba;
      }
      case Color.TYPE_VECTOR: {
        const vector = [];
        for (let i = 0; i < hex.length; i += 2) {
          const bit = hex[i] + hex[i + 1];
          vector.push(parseInt(bit, 16) * Color.INV_255);
        }

        return vector;
      }
      case Color.TYPE_HSVA: {
        return Color.vectorToType(
          Color.hexToType(hex, Color.TYPE_VECTOR),
          Color.TYPE_HSVA,
        );
      }
      default:
        return hex;
    }
  }

  /**
   * Converts a RGBA color to a specified type.
   *
   * @param {RGBAObject} rgba RGBA color object
   * @param {number} colorType supported color type (Color.TYPE_RGBA, Color.TYPE_VECTOR, etc.)
   * @returns specified converted color (rgba, vector, etc.)
   */
  static rgbaToType(rgba, colorType) {
    if (!rgba) rgba = Color.BLACK_RGBA;

    // append alpha tag
    if (rgba.a === undefined) rgba.a = 1;

    switch (colorType) {
      case Color.TYPE_HEX: {
        rgba.a *= 255;
        const vector = [rgba.r, rgba.g, rgba.b, rgba.a].map((c) =>
          Math.round(c).toString(16).padStart(2, "0"),
        );
        return "#" + vector.join("");
      }
      case Color.TYPE_VECTOR: {
        return [
          rgba.r * Color.INV_255,
          rgba.g * Color.INV_255,
          rgba.b * Color.INV_255,
          rgba.a,
        ];
      }
      case Color.TYPE_HSVA: {
        return Color.vectorToType(
          [
            rgba.r * Color.INV_255,
            rgba.g * Color.INV_255,
            rgba.b * Color.INV_255,
            rgba.a,
          ],
          Color.TYPE_HSVA,
        );
      }
      default:
        return rgba;
    }
  }

  /**
   * Converts a Vector color to a specified type.
   *
   * @param {ColorVector} vector vector color array
   * @param {number} colorType supported color type (Color.TYPE_RGBA, Color.TYPE_VECTOR, etc.)
   * @returns specified converted color (rgba, vector, etc.)
   */
  static vectorToType(vector, colorType) {
    if (vector.length < 3) return null;
    if (!vector) vector = Color.BLACK_VECTOR;

    // append alpha tag
    if (vector[3] === undefined) vector[3] = 1;

    switch (colorType) {
      case Color.TYPE_HEX: {
        vector = vector.map((c) =>
          Math.round(c * 255)
            .toString(16)
            .padStart(2, "0"),
        );
        return "#" + vector.join("");
      }
      case Color.TYPE_RGBA: {
        return {
          r: vector[0] * 255,
          g: vector[1] * 255,
          b: vector[2] * 255,
          a: vector[3],
        };
      }
      case Color.TYPE_HSVA: {
        const [r, g, b] = vector;
        const x = Math.min(Math.min(r, g), b);
        const v = Math.max(Math.max(r, g), b);

        let h = 0;
        let s = 0;
        if (x !== v) {
          const f = r === x ? g - b : g === x ? b - r : r - g;
          const i = r === x ? 3 : g === x ? 5 : 1;
          h = ((i - f / (v - x)) * 60) % 360;
          s = (v - x) / v;
        }

        return { h, s, v, a: vector[3] };
      }
      default:
        return vector;
    }
  }

  /**
   * Converts a HSVA color to a specified type.
   *
   * @param {HSVAObject} hsva HSVA color object
   * @param {number} colorType supported color type (Color.TYPE_RGBA, Color.TYPE_VECTOR, etc.)
   * @returns specified converted color (rgba, vector, etc.)
   */
  static hsvaToType(hsva, colorType) {
    if (!hsva) hsva = Color.BLACK_HSVA;

    // append alpha tag
    if (hsva.a === undefined) hsva.a = 1;

    switch (colorType) {
      case Color.TYPE_HEX: {
        return Color.vectorToType(
          Color.hsvaToType(hsva, Color.TYPE_VECTOR),
          Color.TYPE_HEX,
        );
      }
      case Color.TYPE_RGBA: {
        return Color.vectorToType(
          Color.hsvaToType(hsva, Color.TYPE_VECTOR),
          Color.TYPE_RGBA,
        );
      }
      case Color.TYPE_VECTOR: {
        let h = hsva.h % 360;
        if (h < 0) h += 360;
        const s = Math.max(0, Math.min(hsva.s, 1));
        const v = Math.max(0, Math.min(hsva.v, 1));

        const i = Math.floor(h / 60) % 6;
        const f = h / 60 - i;
        const p = v * (1 - s);
        const q = v * (1 - s * f);
        const t = v * (1 - s * (1 - f));

        switch (i) {
          default:
          case 0:
            return [v, t, p, hsva.a];
          case 1:
            return [q, v, p, hsva.a];
          case 2:
            return [p, v, t, hsva.a];
          case 3:
            return [p, q, v, hsva.a];
          case 4:
            return [t, p, v, hsva.a];
          case 5:
            return [v, p, q, hsva.a];
        }
      }
      default:
        return hsva;
    }
  }

  /* Transformations */
  /*
   * We will be using Vectors for transformations as they
   * are efficient and more widely usable (in WebGL, for example).
   */

  /**
   * Mixes 2 Color Vector arrays together, linearly.
   *
   * @param {ColorVector} vec1 starting vector color
   * @param {ColorVector} vec2 ending vector color
   * @param {number} mixAmount how much of vec2 to mix into vect1, ranged from 0-1
   * @returns {ColorVector} mixed vector
   */
  static mixVectors(vec1, vec2, mixAmount) {
    if (!vec1 || !vec2 || vec1.length < 3 || vec2.length < 3) {
      return null;
    }

    // append alpha tags
    if (vec1[3] === undefined) vec1[3] = 1;
    if (vec2[3] === undefined) vec2[3] = 1;

    const amount = Math.max(0, Math.min(1, mixAmount));
    const invAmount = 1 - amount;
    if (amount == 0) return vec1;
    else if (amount == 1) return vec2;
    return [
      invAmount * vec1[0] + amount * vec2[0],
      invAmount * vec1[1] + amount * vec2[1],
      invAmount * vec1[2] + amount * vec2[2],
      invAmount * vec1[3] + amount * vec2[3],
    ];
  }

  /**
   * Blends 2 Color Vector arrays together.
   *
   * @param {ColorVector} vec1 vector color 1
   * @param {ColorVector} vec2 vector color 2
   * @param {number} blendType the type of blending to use (Color.BLEND_ADD, Color.BLEND_SUBTRACT, etc.)
   * @returns {ColorVector} blended vector
   */
  static blendVectors(vec1, vec2, blendType) {
    if (!vec1 || !vec2 || vec1.length < 3 || vec2.length < 3) {
      return null;
    }

    // append alpha tags
    if (vec1[3] === undefined) vec1[3] = 1;
    if (vec2[3] === undefined) vec2[3] = 1;

    switch (blendType) {
      case Color.BLEND_ADD: {
        return vec1.map((c, i) => Math.min(1, c + vec2[i]));
      }
      case Color.BLEND_SUBTRACT: {
        return vec1.map((c, i) => Math.max(0, c - vec2[i]));
      }
      case Color.BLEND_MULTIPLY: {
        return vec1.map((c, i) => c * vec2[i]);
      }
      default:
        return null;
    }
  }

  /**
   * Inverts a Color Vector array.
   *
   * @param {ColorVector} vector vector color to invert
   * @returns {ColorVector} inverted vector
   */
  static invertVector(vector) {
    if (!vector || vector.length < 3) return null;

    const inverted = [1 - vector[0], 1 - vector[1], 1 - vector[2]];
    if (vector[3]) inverted.push(vector[3]);
    return inverted;
  }

  /**
   * Checks if 2 Color Vector arrays are the same with a given softness.
   * Higher softness assumes colors are more closely related, i.e. red === orange
   *
   * @param {ColorVector} vec1 vector color 1
   * @param {ColorVector} vec2 vector color 2
   * @param {number} softness determines how sensitive we check color equality, ranged 0-1 (uncapped)
   * @returns {Boolean} true if 2 vectors are the same
   */
  static vectorMatches(vec1, vec2, softness) {
    if (!vec1 || !vec2 || vec1.length < 3 || vec2.length < 3) {
      return false;
    }

    // append alpha tags
    if (vec1[3] === undefined) vec1[3] = 1;
    if (vec2[3] === undefined) vec2[3] = 1;

    const soft = softness ?? 0;

    const CHANNELS = 4; // [r,g,b,a] = 4 channels
    let componentMatches = 0;
    for (let i = 0; i < CHANNELS; i++) {
      const c1 = vec1[i];
      const c2 = vec2[i];
      if (c2 >= c1 - soft && c1 + soft >= c2) {
        componentMatches++;
      }
    }

    return componentMatches === CHANNELS;
  }
}

export { Color };
