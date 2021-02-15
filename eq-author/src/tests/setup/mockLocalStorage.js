export default (function () {
  var localStorageMock = (function () {
    var store = {};

    return {
      getItem: function (key) {
        return store[key] || null;
      },
      setItem: function (key, value) {
        store[key] = value.toString();
      },
      clear: function () {
        store = {};
      },
      removeItem: function (key) {
        delete store[key];
      },
    };
  })();

  Object.defineProperty(window, "localStorage", {
    value: localStorageMock,
  });
})();
