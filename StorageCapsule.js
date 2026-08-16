/**
 * Manage data for LocalStorage using a simple interface with basic data compression.
 *
 * @author Vicente G. (@SharkPool-SP)
 *
 * @version 2026.1.0.0
 */
class StorageCapsule {
  /** Supported data types */
  static TYPE_AUTO = -1; // Note: TYPE_AUTO will change *once* to one of the below types
  static TYPE_STRING = 0;
  static TYPE_NUMBER = 1;
  static TYPE_ARRAY = 2;
  static TYPE_OBJECT = 3;

  /** Data compression library (modified) */
  /*!
    https://github.com/pieroxy/lz-string
    We use it under this license:

    MIT License

    Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
  */
  /* eslint-disable */
  // prettier-ignore
  static LZString=function(){var o=String.fromCharCode,r={compress:function(i){return r._compress(i,16,function(r){return o(r)})},_compress:function(o,r,i){if(null==o)return"";var $,e,_,t={},n={},s="",p="",a="",f=2,l=3,u=2,c=[],h=0,d=0;for(_=0;_<o.length;_+=1)if(s=o.charAt(_),Object.prototype.hasOwnProperty.call(t,s)||(t[s]=l++,n[s]=!0),p=a+s,Object.prototype.hasOwnProperty.call(t,p))a=p;else{if(Object.prototype.hasOwnProperty.call(n,a)){if(256>a.charCodeAt(0)){for($=0;$<u;$++)h<<=1,d==r-1?(d=0,c.push(i(h)),h=0):d++;for($=0,e=a.charCodeAt(0);$<8;$++)h=h<<1|1&e,d==r-1?(d=0,c.push(i(h)),h=0):d++,e>>=1}else{for($=0,e=1;$<u;$++)h=h<<1|e,d==r-1?(d=0,c.push(i(h)),h=0):d++,e=0;for($=0,e=a.charCodeAt(0);$<16;$++)h=h<<1|1&e,d==r-1?(d=0,c.push(i(h)),h=0):d++,e>>=1}0==--f&&(f=Math.pow(2,u),u++),delete n[a]}else for($=0,e=t[a];$<u;$++)h=h<<1|1&e,d==r-1?(d=0,c.push(i(h)),h=0):d++,e>>=1;0==--f&&(f=Math.pow(2,u),u++),t[p]=l++,a=String(s)}if(""!==a){if(Object.prototype.hasOwnProperty.call(n,a)){if(256>a.charCodeAt(0)){for($=0;$<u;$++)h<<=1,d==r-1?(d=0,c.push(i(h)),h=0):d++;for($=0,e=a.charCodeAt(0);$<8;$++)h=h<<1|1&e,d==r-1?(d=0,c.push(i(h)),h=0):d++,e>>=1}else{for($=0,e=1;$<u;$++)h=h<<1|e,d==r-1?(d=0,c.push(i(h)),h=0):d++,e=0;for($=0,e=a.charCodeAt(0);$<16;$++)h=h<<1|1&e,d==r-1?(d=0,c.push(i(h)),h=0):d++,e>>=1}0==--f&&(f=Math.pow(2,u),u++),delete n[a]}else for($=0,e=t[a];$<u;$++)h=h<<1|1&e,d==r-1?(d=0,c.push(i(h)),h=0):d++,e>>=1;0==--f&&(f=Math.pow(2,u),u++)}for($=0,e=2;$<u;$++)h=h<<1|1&e,d==r-1?(d=0,c.push(i(h)),h=0):d++,e>>=1;for(;;){if(h<<=1,d==r-1){c.push(i(h));break}d++}return c.join("")},decompress:function(o){return null==o?"":""==o?null:r._decompress(o.length,32768,function(r){return o.charCodeAt(r)})},_decompress:function(r,i,$){var e,_,t,n,s,p,a,f,l=[],u=4,c=4,h=3,d="",v=[],w={val:$(0),position:i,index:1};for(_=0;_<3;_+=1)l[_]=_;for(n=0,p=4,a=1;a!=p;)s=w.val&w.position,w.position>>=1,0==w.position&&(w.position=i,w.val=$(w.index++)),n|=(s>0?1:0)*a,a<<=1;switch(e=n){case 0:for(n=0,p=256,a=1;a!=p;)s=w.val&w.position,w.position>>=1,0==w.position&&(w.position=i,w.val=$(w.index++)),n|=(s>0?1:0)*a,a<<=1;f=o(n);break;case 1:for(n=0,p=65536,a=1;a!=p;)s=w.val&w.position,w.position>>=1,0==w.position&&(w.position=i,w.val=$(w.index++)),n|=(s>0?1:0)*a,a<<=1;f=o(n);break;case 2:return""}for(l[3]=f,t=f,v.push(f);;){if(w.index>r)return"";for(n=0,p=Math.pow(2,h),a=1;a!=p;)s=w.val&w.position,w.position>>=1,0==w.position&&(w.position=i,w.val=$(w.index++)),n|=(s>0?1:0)*a,a<<=1;switch(f=n){case 0:for(n=0,p=256,a=1;a!=p;)s=w.val&w.position,w.position>>=1,0==w.position&&(w.position=i,w.val=$(w.index++)),n|=(s>0?1:0)*a,a<<=1;l[c++]=o(n),f=c-1,u--;break;case 1:for(n=0,p=65536,a=1;a!=p;)s=w.val&w.position,w.position>>=1,0==w.position&&(w.position=i,w.val=$(w.index++)),n|=(s>0?1:0)*a,a<<=1;l[c++]=o(n),f=c-1,u--;break;case 2:return v.join("")}if(0==u&&(u=Math.pow(2,h),h++),l[f])d=l[f];else{if(f!==c)return null;d=t+t.charAt(0)}v.push(d),l[c++]=t+d.charAt(0),u--,t=d,0==u&&(u=Math.pow(2,h),h++)}}};return r}();

  /**
   * Returns the datatype of data.
   *
   * @private
   * @param {*} data the data to be type checked
   * @returns the supported datatype if found, "unknown" if not found
   */
  static _getTypeFromData(data) {
    if (data === null || data === undefined) return "unknown";

    if (typeof data === "string") return StorageCapsule.TYPE_STRING;
    if (typeof data === "number") return StorageCapsule.TYPE_NUMBER;
    if (Array.isArray(data)) return StorageCapsule.TYPE_ARRAY;
    if (data && typeof data === "object") return StorageCapsule.TYPE_OBJECT;

    return "unknown";
  }

  /**
   * Checks if data to be stored in a dataspace is of the same type.
   *
   * @private
   * @param {*} dataSpace the dataspace used for comparison
   * @param {*} data the data to be type checked
   * @throws Error if dataspace type and stored data type mismatch
   */
  static _validateDataType(dataSpace, data) {
    const type = StorageCapsule._getTypeFromData(data);
    if (dataSpace.type === StorageCapsule.TYPE_AUTO) {
      // initialize the datatype
      if (type === "unknown") {
        throw new Error("Unsupported Datatype: " + data);
      }

      dataSpace.type = type;
    } else if (type !== dataSpace.type) {
      console.warn("Required type: " + dataSpace.type + "Attempted: " + type);
      throw new Error("StorageCapsule Datatype Mismatch!");
    }
  }

  /**
   * Compresses a dataspace.
   *
   * @private
   * @param {Object} entry the dataspace to be compressed
   * @returns String representing the compressed dataspace
   */
  static _compressDataSpace(entry) {
    const [name, dataSpace] = entry;
    const { type, data } = dataSpace;

    const compress = (type, data, splitter, escape) => {
      let compressed;

      switch (type) {
        case StorageCapsule.TYPE_STRING: {
          const lzCompressed = StorageCapsule.LZString.compress(data);
          if (lzCompressed.length >= data.length) {
            // compressed data is bigger
            type = 0;
            compressed = data;
          } else {
            // compressed data is smaller
            type = "S";
            compressed = lzCompressed;
          }

          break;
        }
        case StorageCapsule.TYPE_NUMBER: {
          // not much we can do with numbers...
          // try to compress a number as best as we can
          compressed = parseFloat(data.toFixed(5));
          break;
        }
        case StorageCapsule.TYPE_ARRAY: {
          compressed = StorageCapsule.LZString.compress(JSON.stringify(data));
          break;
        }
        case StorageCapsule.TYPE_OBJECT: {
          const entries = Object.entries(data);
          compressed = StorageCapsule.LZString.compress(
            JSON.stringify(entries),
          );
          break;
        }
      }

      if (splitter && escape) {
        compressed = ("" + compressed).replaceAll(splitter, escape);
      }
      return "" + type + compressed;
    };

    const nameCode = compress(StorageCapsule.TYPE_STRING, name, ".", "\\.");
    const dataCode = compress(type, data, ".", "\\.");
    return nameCode + "." + dataCode;
  }

  /**
   * Decompresses a compressed dataspace.
   *
   * @private
   * @param {String} item the compressed dataspace
   * @returns an array containing the decompressed dataspace, item 0 is its name, item 1 is its value
   */
  static _decompressDataSpace(item) {
    const [name, data] = item.match(/(\\.|[^.])+/g);

    const decompress = (data, return_as_dataspace) => {
      let type = data.charAt(0);
      let value = "";
      for (let i = 1; i < data.length; i++) value += data[i];

      const isUnnormalizedString = type === "S";
      type = isUnnormalizedString ? 0 : parseInt(type);

      switch (type) {
        case StorageCapsule.TYPE_STRING: {
          value = value.replaceAll("\\.", ".").replaceAll("\\,", ",");
          if (isUnnormalizedString) {
            // this is LZ compressed, decode it!
            type = StorageCapsule.TYPE_STRING;
            value = StorageCapsule.LZString.decompress(value);
          }

          break;
        }
        case StorageCapsule.TYPE_NUMBER: {
          value = parseFloat(value.replaceAll("\\.", "."));
          break;
        }
        case StorageCapsule.TYPE_ARRAY: {
          value = StorageCapsule.LZString.decompress(value);
          value = JSON.parse(value);
          break;
        }
        case StorageCapsule.TYPE_OBJECT: {
          value = StorageCapsule.LZString.decompress(value);
          value = Object.fromEntries(JSON.parse(value));
          break;
        }
      }

      return return_as_dataspace ? { type, data: value } : value;
    };

    return [decompress(name, false), decompress(data, true)];
  }

  /**
   * Constructs a StorageCapsule object.
   *
   * @param {String} namespace the namespace that will be used in LocalStorage
   */
  constructor(namespace) {
    this.namespace = String(namespace) ?? "LocalStorageCapsule";
    this.dataSpaces = new Map();
  }

  /**
   * Register a dataspace for use.
   *
   * @param {String} name  the name of this dataspace
   * @param {Number} type the supported data type that this space will use
   */
  registerDataSpace(name, type) {
    const spaceName = String(name);
    if (
      !spaceName ||
      typeof type !== "number" ||
      type > StorageCapsule.TYPE_OBJECT ||
      type < StorageCapsule.TYPE_AUTO
    ) {
      throw new Error(`Dataspace registration: name or type is invalid`);
    }

    this.dataSpaces.set(spaceName, { type, data: undefined });
  }

  /**
   * Remove a dataspace from this namespace.
   *
   * @param {String} name the name of the dataspace
   */
  deleteDataSpace(name) {
    this.dataSpaces.delete(String(name));
  }

  /**
   * Checks if a dataspace exists.
   *
   * @param {String} name the name of the dataspace
   * @returns true if a dataspace of requested name exists
   */
  hasDataSpace(name) {
    return this.dataSpaces.has(String(name));
  }

  /**
   * Stores data of a specified type in a specified dataspace.
   *
   * @param {String} name the name of the dataspace
   * @param {*} data the data to be stored (must be a supported type)
   */
  store(name, data) {
    const spaceName = String(name);
    const storedData = this.dataSpaces.get(spaceName);
    if (!storedData) {
      throw new Error(
        `${this.namespace} StorageCapsule does not have a data space named: "${spaceName}"!`,
      );
    }

    StorageCapsule._validateDataType(storedData, data);
    storedData.data = data;
  }

  /**
   * Get the data of a requested dataspace.
   *
   * @param {String} name the name of the dataspace
   * @returns data of the requested dataspace
   */
  get(name) {
    const spaceName = String(name);
    const storedData = this.dataSpaces.get(spaceName);
    if (!storedData) {
      return null;
    }

    return storedData.data;
  }

  /**
   * Get all dataspaces of this namespace.
   *
   * @returns Object of registered dataspaces
   */
  getAll() {
    const data = {};
    if (this.dataSpaces.size > 0) {
      const entries = this.dataSpaces.entries();
      let iteratorItem = entries.next();

      do {
        data[iteratorItem.value[0]] = iteratorItem.value[1].data;
        iteratorItem = entries.next();
      } while (!iteratorItem.done);
    }

    return data;
  }

  /**
   * Compresses and sends the data of this namespace to LocalStorage.
   */
  pushData() {
    const data = [];
    if (this.dataSpaces.size > 0) {
      const entries = this.dataSpaces.entries();
      let iteratorItem = entries.next();

      do {
        if (iteratorItem.value[1].data !== undefined) {
          const compressed = StorageCapsule._compressDataSpace(
            iteratorItem.value,
          ).replaceAll(",", "\\,");
          data.push(compressed);
        }

        iteratorItem = entries.next();
      } while (!iteratorItem.done);
    }

    localStorage.setItem(this.namespace, data.join(","));
  }

  /**
   * Retrieves and decodes the data of this namespace from LocalStorage.
   */
  retrieveData() {
    const stored = localStorage.getItem(this.namespace);
    if (!stored) return;

    try {
      const data = stored.match(/(\\.|[^,])+/g);
      for (const item of data) {
        const decompressed = StorageCapsule._decompressDataSpace(item);
        this.dataSpaces.set(decompressed[0], decompressed[1]);
      }
    } catch (e) {
      console.warn("Malformed Data!", e);
      localStorage.removeItem(this.namespace);
    }
  }
}

export { StorageCapsule };
