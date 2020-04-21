const store = {};

module.exports = function(k, v) {
  if(v !== undefined) {
    store[k] = v;
  }

  return store[k];
}