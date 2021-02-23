/**
 * Utility module with helper functions
 */
export default {
  /**
   * Returns a random number between min and max
   * @param {number} min Minimum value
   * @param {number} max Maximum value
   */
  getRand(min, max) {
    return (Math.random() * (max - min)) + min;
  },

  /**
   * Return the correct height of a dom element including MARGIN and BORDER!
   * @param {object} elm The dom element to measure
   */
  getFullHeight(elm) {
    const elmHeight = document.defaultView.getComputedStyle(elm, '').getPropertyValue('height');
    const elmMargin = parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-top'), 10) + parseInt(document.defaultView.getComputedStyle(elm, '').getPropertyValue('margin-bottom'), 10);
    return (parseInt(elmHeight, 10) + parseInt(elmMargin, 10));
  },

  /**
   * Removes all elements which have or not-have the given keyword
   * @param {array} stream The stream array
   * @param {string} keyword The keyword to filter for
   * @param {boolean} have Set to true if tweets should be removed that have the keyword
   * @param {boolean} onlyDisable Set this to true if element should only be hidden
   */
  filterStream(stream, keyword, have, onlyDisable) {
    for (let i = 0; i < stream.length; i += 1) {
      const streamElement = stream[i];
      if (have === true) {
        if (streamElement.text.toLowerCase().indexOf(keyword.toLowerCase()) !== -1) {
          if (onlyDisable === true) {
            streamElement.disabled = true;
          } else {
            stream.splice(i, 1);
            i -= 1;
          }
        }
      } else if (streamElement.text.toLowerCase().indexOf(keyword.toLowerCase()) === -1) {
        if (onlyDisable === true) {
          streamElement.disabled = true;
        } else {
          stream.splice(i, 1);
          i -= 1;
        }
      }
    }
  },

  /**
   * Replaces all occurences of "find" in "str" with "replace"
   * @param {string} str The string to search in
   * @param {string} find The string to search for
   * @param {string} replace The new string to put in favor of "find"
   */
  replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  },

  /**
   * Will create a shallow copy of the given array
   * @param {array} arr The array to copy
   */
  copyArray(arr) {
    const arr2 = [];
    if (arr) {
      for (let i = 0; i < arr.length; i += 1) {
        arr2.push({ ...arr[i] });
      }
    }
    return arr2;
  },

  getWindowSizes() {
    const w = window;
    const d = document;
    const e = d.documentElement;
    const g = d.getElementsByTagName('body')[0];
    const x = w.innerWidth || e.clientWidth || g.clientWidth;
    const y = w.innerHeight || e.clientHeight || g.clientHeight;

    return {
      width: x,
      height: y,
    };
  },

  /**
   * Merges array b into the head of array a
   * @param {array} a The base array
   * @param {array} b The array to merge in front of a
   */
  arrayFrontMerge(a, b) {
    if (a && b) {
      for (let i = 0; i < b.length; i += 1) {
        a.unshift(b[i]);
      }
    }
  },

  arrayPushMerge(a, b) {
    if (a && b) {
      for (let i = 0; i < b.length; i += 1) {
        a.push(b[i]);
      }
    }
  },

};
