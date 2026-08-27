/**
 * Dynamic asset loader that fetches & imports HTML, CSS, & JS.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class ModuleLoader {
  /** URLs of CSS and JavaScript dependencies that have already been loaded */
  static LOADED_DEPENDENCIES = new Set();

  /** Cached HTML content keyed by its URL */
  static CONTENT_CACHE = new Map();

  /**
   * Imports a dependency and applies it to the DOM.
   * Supports HTML, CSS, and JavaScript.
   *
   * @param {String} url URL of the dependency to load
   * @param {Element} [opt_container] Optional container to put the content of an HTML dependancy,
   *                                  defaults to the document body
   */
  static async importDependency(url, opt_container) {
    if (ModuleLoader.LOADED_DEPENDENCIES.has(url)) return;

    const container =
      opt_container && opt_container instanceof Element
        ? opt_container
        : document.body;

    const pathname = new URL(url, window.location.href).pathname;
    const type = pathname
      .substring(pathname.lastIndexOf(".") + 1)
      .toLowerCase();

    switch (type) {
      case "html": {
        let htmlText;

        if (ModuleLoader.CONTENT_CACHE.has(url)) {
          htmlText = ModuleLoader.CONTENT_CACHE.get(url);
        } else {
          const response = await fetch(url);
          if (!response.ok) {
            console.error(response);
            throw new Error(`Couldn't fetch dependency: ${url}`);
          }

          htmlText = await response.text();
          ModuleLoader.CONTENT_CACHE.set(url, htmlText);
        }

        container.insertAdjacentHTML("beforeend", htmlText);
        return;
      }
      case "css": {
        const element = document.createElement("link");
        element.rel = "stylesheet";
        element.href = url;

        await new Promise((resolve, reject) => {
          element.onload = resolve;
          element.onerror = (error) => {
            console.error(error);
            reject(new Error(`Failed to load dependency: ${url}`));
          };

          document.head.appendChild(element);
        });

        ModuleLoader.LOADED_DEPENDENCIES.add(url);
        return;
      }
      case "js": {
        const element = document.createElement("script");
        element.type = "module";
        element.src = url;

        await new Promise((resolve, reject) => {
          element.onload = resolve;
          element.onerror = (error) => {
            console.error(error);
            reject(new Error(`Failed to load dependency: ${url}`));
          };

          document.body.appendChild(element);
        });

        ModuleLoader.LOADED_DEPENDENCIES.add(url);
        return;
      }
      default:
        throw new Error(`Unsupported dependency type: ${type}`);
    }
  }

  /**
   * Imports a list of dependencies.
   *
   * @param {Array<String>} urls Array of URL dependencies to load
   * @returns {Promise<void>}
   */
  static async importDependencies(urls) {
    return Promise.all(urls.map((url) => ModuleLoader.importDependency(url)));
  }

  /**
   * Dynamically imports an ES module.
   *
   * @param {String} url URL of the module to load
   * @returns {Promise<Module>} Module namespace object
   */
  static importModule(url) {
    return import(url);
  }

  /**
   * Fetches and evaluates a JavaScript source,
   * returning the result of the specified expression.
   *
   * Unlike importModule(), this does not execute the source as an
   * ES module (i.e., does not support import/export syntax).
   *
   * @param {String} url URL of the JavaScript source to evaluate
   * @param {String} returnExpression Expression whose result should be returned
   * @returns {Promise<*>} Result of the evaluated expression
   */
  static async evalAndReturn(url, returnExpression) {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Couldn't fetch module: ${url}`);
    }

    const moduleCode = await response.text();
    const code = `${moduleCode}\nreturn ${returnExpression};`;
    const executor = new Function(code);

    return executor();
  }
}

export { ModuleLoader };
