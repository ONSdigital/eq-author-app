module.exports = {
  mongodbMemoryServerOptions: {
    binary: {
      version: "5.0.8",
      skipMD5: true,
    },
    instance: {
      dbName: "test_author",
    },
    autoStart: false,
  },
};
