/**
 * Create an object composed of the picked object properties
 * @param {Object} object
 * @param {string[]} keys
 * @returns {Object}
 */
const pickSearch = (object, keys) => {
  const conditions = keys.reduce((obj, key) => {
    if (object && Object.prototype.hasOwnProperty.call(object, key)) {
      // obj[key] = { $regex: object[key] };
      /* eslint-disable-next-line no-param-reassign, security/detect-non-literal-regexp */
      obj[key] = new RegExp(`.*${object[key]}.*`, 'i');
    }

    return obj;
  }, {});

  // return {
  //   $and: [conditions]
  // };

  return conditions;
};

module.exports = pickSearch;
