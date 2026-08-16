/**
 * Generate random strings for unique IDs.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class UUID {
  static DEFAULT_LENGTH = 15;
  static DEFAULT_SOUP =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  static _soup = UUID.DEFAULT_SOUP;

  /**
   * Sets the different characters the UUID can be made from.
   *
   * @param {String} soup string of characters
   */
  static setSoup(soup) {
    if (!soup || typeof soup !== "string" || soup.length === 0) {
      UUID._soup = UUID.DEFAULT_SOUP;
    } else {
      UUID._soup = soup;
    }
  }

  /**
   * Returns the characters the UUID can be made from.
   *
   * @returns string of characters
   */
  static getSoup() {
    return UUID._soup;
  }

  /**
   * Generates a UUID.
   *
   * @param {Number} opt_length (Optional) determines the length of the UUID, defaults to DEFAULT_LENGTH.
   * @returns Randomized UUID string
   */
  static gen(opt_length) {
    const length = opt_length
      ? Math.max(1, Math.round(opt_length))
      : UUID.DEFAULT_LENGTH;
    const soup = UUID.getSoup();
    const soupLength = soup.length;

    let uuid = "";
    for (let i = 0; i < length; i++) {
      uuid += soup[Math.floor(Math.random() * soupLength)];
    }

    return uuid;
  }

  /**
   * Generates a compact hash from a string using the FNV-1a algorithm.
   *
   * @param {string} value String to hash
   * @returns {string} Base-36 encoded hash
   */
  static hash(value) {
    value = String(value);

    let hash = 0x811c9dc5;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 0x01000193);
    }

    return hash.toString(36);
  }
}

export { UUID };
