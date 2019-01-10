/*
 * Polyfill
 */

export const objectEntries =
  typeof Object.entries === "function"
    ? Object.entries
    : function(obj: object) {
        const entries = [];
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
            entries.push([key, obj[key]]);
          }
        }
        return entries;
      };

export const objectValues =
  typeof Object.values === "function"
    ? Object.values
    : function(obj: object) {
        const values = [];
        for (const key in obj) {
          if (obj.hasOwnProperty(key) && obj.propertyIsEnumerable(key)) {
            values.push(obj[key]);
          }
        }
        return values;
      };
