module.exports = (req, res) => {
  res.json({
    status: "OK",
    storage: process.env.DATABASE,
    version: process.env.EQ_AUTHOR_API_VERSION,
  });
};
